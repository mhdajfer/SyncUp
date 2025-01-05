"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import SimplePeer, { SignalData } from "simple-peer";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import Image from "next/image";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from "lucide-react";

import DEFAULT_IMAGE from "../../../public/DefaultImg.avif";
import { User } from "@/interfaces/User";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface IncomingCallInfo {
  isSomeoneCalling: boolean;
  from: string;
  signalData: SignalData;
}

export function VideoCall({ users }: { users: User[] }) {
  const currentUserId = useSelector(
    (state: RootState) => state.auth.user?._id
  ) as string;
  const myVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<SimplePeer.Instance | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCallAccepted, setIsCallAccepted] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isVideoOff, setIsVideoOff] = useState<boolean>(true);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [incominCallInfo, setIncominCallInfo] = useState<IncomingCallInfo>({
    isSomeoneCalling: false,
    from: "",
    signalData: {} as SignalData,
  });

  const END_POINT = "https://syncup.mhdajfer.in";
  const socket = useMemo(() => {
    return io(END_POINT, {
      path: "/comm/socket.io",
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });
  }, []);

  const destroyConnection = useCallback(() => {
    toast.info("Call ended successfully");
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    window.location.reload();
  }, [stream]);

  const initializeSocketEvents = useCallback(
    (socket: Socket) => {
      socket.on("connect", () => {
        console.log("Connected to video socket:", socket.id);
        socket.emit("registerUser", {
          userId: currentUserId,
          socketId: socket.id,
        });
      });

      socket.on(
        "incomingCall",
        ({ from, signalData }: { from: string; signalData: SignalData }) => {
          setSelectedUserId(from);
          setIncominCallInfo({ isSomeoneCalling: true, from, signalData });
        }
      );

      socket.on("callEnded", destroyConnection);

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        toast.error("Connection failed. Retrying...");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from video socket");
        toast.error("Connection lost. Reconnecting...");
      });
    },
    [currentUserId, destroyConnection]
  );

  const requestMediaStream = async () => {
    try {
      toast.success(`Requesting media stream ${isVideoOff}`);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: isVideoOff,
        audio: !isMuted,
      });
      setStream(mediaStream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  useEffect(() => {
    if (!socket || !currentUserId)
      return console.error("socket or current user not available");
    initializeSocketEvents(socket);

    return () => {
      socket.off("incomingCall");
      socket.off("callEnded");
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.off("incomingCall");
      socket.off("callAccepted");
      socket.off("callEnded");
    };
  }, [socket, destroyConnection, initializeSocketEvents, currentUserId]);

  const initiateCall = () => {
    if (selectedUserId) {
      const peer = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: stream || undefined,
      });

      peer.on("signal", (signalData) => {
        socket.emit("initiateCall", {
          selectedUserId,
          signalData,
          myId: currentUserId,
        });
      });

      peer.on("stream", (remoteStream) => {
        if (peerVideoRef.current) {
          peerVideoRef.current.srcObject = remoteStream;
        }
      });

      socket.on("callAccepted", (signal: SignalData) => {
        setIsCallAccepted(true);
        peer.signal(signal);
      });

      connectionRef.current = peer;
    } else {
      toast.error("Please enter a user ID to initiate a call");
    }
  };

  const answerCall = () => {
    setIsCallAccepted(true);

    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream: stream || undefined,
    });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: incominCallInfo.from });
    });

    peer.on("stream", (currentStream) => {
      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = currentStream;
      }
    });

    peer.signal(incominCallInfo.signalData);
    connectionRef.current = peer;
  };

  const endCall = () => {
    socket.emit("endCall", { selectedUserId, currentUserId });
    destroyConnection();
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newState = !prev;
      if (stream) {
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !newState;
        });
      } else if (!newState) {
        requestMediaStream();
      }
      return newState;
    });
  };

  const toggleVideo = async () => {
    setIsVideoOff((prev) => {
      const newState = !prev;
      if (stream) {
        if (newState) {
          // Turn off video
          stream.getVideoTracks().forEach((track) => track.stop());
          const newStream = new MediaStream(stream.getAudioTracks());
          setStream(newStream);
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = newStream;
          }
        } else {
          // Turn on video
          navigator.mediaDevices
            .getUserMedia({ video: true, audio: !isMuted })
            .then((newMediaStream) => {
              const combinedStream = new MediaStream([
                ...newMediaStream.getVideoTracks(),
                ...stream.getAudioTracks(),
              ]);
              setStream(combinedStream);
              if (myVideoRef.current) {
                myVideoRef.current.srcObject = combinedStream;
              }
            })
            .catch((error) => {
              console.error("Error turning on video:", error);
            });
        }
      } else if (!newState) {
        // If no stream is active, request new media stream
        requestMediaStream();
      }
      return newState;
    });
  };

  return (
    <div className="min-h-screen mt-[-35px] w-full bg-gradient-to-b from-gray-900 to-gray-800 p-4 md:p-8">
      <Card className="max-w-5xl mx-auto bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-center text-white mb-8">
            Video Call
          </h2>

          <div className="grid gap-6">
            {!isCallAccepted && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={selectedUserId}
                  onValueChange={(value) => {
                    setSelectedUserId(value);
                  }}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder={"Select user"} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {users.map((user) => (
                      <SelectItem
                        key={user._id}
                        value={user._id || ""}
                        className="text-white hover:bg-gray-700 focus:bg-gray-700"
                      >
                        {user.firstName + " " + user.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={initiateCall}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call User
                </Button>
              </div>
            )}

            <div className="text-sm text-gray-400 text-center">
              Start Meeting
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white text-center">
                  Your Video
                </h3>
                <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-video">
                  {!isVideoOff ? (
                    <video
                      ref={myVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={DEFAULT_IMAGE}
                      alt="No video available"
                      layout="fill"
                      objectFit="cover"
                    />
                  )}
                </div>
              </div>

              {isCallAccepted && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white text-center">
                    Peer Video
                  </h3>
                  <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-video">
                    <video
                      ref={peerVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={toggleMute}
                variant="outline"
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                {isMuted ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4 text-white" />
                )}
              </Button>
              <Button
                onClick={toggleVideo}
                variant="outline"
                className="bg-gray-800 border-gray-700 hover:bg-gray-700"
              >
                {isVideoOff ? (
                  <VideoOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Video className="h-4 w-4 text-white" />
                )}
              </Button>
              {isCallAccepted && (
                <Button
                  onClick={endCall}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <PhoneOff className="mr-2 h-4 w-4" />
                  End Call
                </Button>
              )}
            </div>

            {incominCallInfo?.isSomeoneCalling && !isCallAccepted && (
              <div className="flex flex-col items-center gap-4 p-4 bg-gray-800 rounded-lg">
                <p className="text-white">
                  Incoming call from:{" "}
                  <span className="font-mono">{incominCallInfo?.from}</span>
                </p>
                <Button
                  onClick={answerCall}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Answer Call
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
