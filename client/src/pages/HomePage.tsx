import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";
import MainSection from "../../components/MainSection.tsx";

const HomePage = () => {
  const userData = useSelector((state: RootState) => state.auth.userData);

  return (
    <div>
      <MainSection userData={userData} />
    </div>
  );
};

export default HomePage;
