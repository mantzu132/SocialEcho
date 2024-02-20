import { useSelector } from "react-redux";
import { RootState } from "../../state/store.ts";

const HomePage = () => {
  const successMessage = useSelector(
    (state: RootState) => state.auth?.successMessage,
  );
  return (
    <div>
      <div>HELLO WORLD and {successMessage}</div>
    </div>
  );
};

export default HomePage;
