import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from '../firebase';

export const findUserByEmail = async (email: string): Promise<string | null> => {
  const usersRef = ref(database, 'users');
  const emailQuery = query(usersRef, orderByChild('email'), equalTo(email));
  const snapshot = await get(emailQuery);
  
  if (!snapshot.exists()) return null;
  
  // Get the first user ID with matching email
  const [[userId]] = Object.entries(snapshot.val());
  return userId;
};