
import { signInFailure} from "@/redux/user/userSlice";

export const handleError = (response: any, dispatch: Function) => {
    const { status, data } = response;

    if (status === 404) {
      dispatch(signInFailure(data.message));
      alert("User does not exist. Please register.");
    } else if (status === 401) {
      dispatch(signInFailure(data.message));
      alert("Invalid credentials. Please try again.");
    } else {
      dispatch(signInFailure(data.message || "An error occurred."));
      alert(data.message || "An error occurred. Please try again.");
    }
  };
