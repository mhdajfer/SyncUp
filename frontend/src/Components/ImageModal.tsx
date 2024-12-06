import { Dialog, DialogContent } from "@/Components/ui/dialog";
import Image from "next/image";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ImageModal({ isOpen, onClose, imageUrl }: ImageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="mt-6">
          <Image
            src={imageUrl}
            alt="Full size image"
            width={400}
            height={400}
            className="rounded-lg"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
