
import { signInFailure} from "@/redux/user/userSlice";

export const handleError = (response: any, dispatch: Function) => {
    const { status, data } = response;

    if (status === 404) {
      dispatch(signInFailure(data.message));
      return ("User does not exist. Please register.");
    } else if (status === 401) {
      dispatch(signInFailure(data.message));
      return ("Invalid credentials. Please try again.");
    } 
    else if (status === 409) {
      dispatch(signInFailure(data.message));
      return ("User already exists. Please try logging in.");
    }
    else {
      dispatch(signInFailure(data.message || "An error occurred."));
      return (data.message || "An error occurred. Please try again.");
    }
  }

