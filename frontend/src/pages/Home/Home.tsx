import Menu from "../../components/SideMenu";

import Initial from "../../components/Initial";

export default function Home() {
  return (
    <div className="h-screen flex flex-row bg-green-100 font-serif">
      <div className="fixed inset-0  md:relative z-50">
        <Menu />
      </div>
      <div className="z-10 w-full">
        <Initial />
      </div>
    </div>
  );
}
