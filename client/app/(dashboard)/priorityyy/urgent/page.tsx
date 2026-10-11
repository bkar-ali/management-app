import ReuseablePriority from "../ReuseablePriority";
import { Priority } from "@/app/store/api";

const Urgent = () => {
  return <ReuseablePriority priority={Priority.Urgent} />;
};

export default Urgent;
