import ManagerLayout from "@/Components/Layout/ManagerLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="w-fit bg-blue-800">
        <ManagerLayout />
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};

export default Layout;
