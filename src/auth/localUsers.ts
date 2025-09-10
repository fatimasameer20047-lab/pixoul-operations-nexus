export type StaffUser = {
  id: string;
  username: string;
  password: string;
  full_name: string;
  department?: string;
};

export const LOCAL_USERS: StaffUser[] = [
  { 
    id: "1", 
    username: "Fatima123", 
    password: "Pixoul123", 
    full_name: "Fatima Samer", 
    department: "AI" 
  },
  { 
    id: "2", 
    username: "Hala123", 
    password: "Hala_Pixoul", 
    full_name: "Hala Samer", 
    department: "AI" 
  },
  { 
    id: "3", 
    username: "Aliya123", 
    password: "Aliya_Pixoul", 
    full_name: "Aliya Haidar", 
    department: "AI" 
  }
];