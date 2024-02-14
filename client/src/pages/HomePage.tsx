import LeftBar from "../../components/home/LeftBar.tsx";
import RightBar from "../../components/home/RightBar.tsx";
import MainSection from "../../components/home/MainSection.tsx";

const HomePage = () => {
  return (
    <div className="flex justify-center">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2">
            <LeftBar />
          </div>
          <div className="col-span-8">
            <MainSection />
          </div>
          <div className="col-span-2">
            <RightBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
