import { RingLoader } from "react-spinners";

export default function Loader() {
    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <RingLoader color="#00A86B" size={100} />
        </div>
    );
}