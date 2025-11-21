import Menu from "../../components/SideMenu";
import Initial from "../../components/Initial";

export default function Home() {
  return (
    <div className="h-screen flex flex-row bg-slate-800 font-serif">
      <div className="absolute inset-0 md:relative ">
        <Menu />
      </div>
      <div className=" w-full">
        <Initial />
      </div>
    </div>
  );
}
