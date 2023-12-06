import { getFirestore } from "firebase/firestore";
import FirebaseApp from "./FirebaseApp";

const Firestore = getFirestore(FirebaseApp);

export default Firestore;