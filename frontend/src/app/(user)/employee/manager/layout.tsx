
import SideBar from "@/Components/Layout/SideBar";

const ManagerLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <SideBar />
      <div>{children}</div>
    </div>
  );
};

export default ManagerLayout;
