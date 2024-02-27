import { initialStateTypes } from "../state/auth/authSlice.ts";

interface MainSectionProps {
  userData: initialStateTypes["userData"];
}

const MainSection = ({ userData }: MainSectionProps) => {
  return <div className="main-section">HELLO FROM MainSection</div>;
};

export default MainSection;
