import { createClient } from '@supabase/supabase-js'

// Supabase configuration dengan fallback untuk build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our client form data
export interface ClientFormData {
  id?: string;
  nama_lengkap: string;
  nomor_hp: string;
  email: string;
  jumlah_entitas: number;
  jasa_yang_dibutuhkan: string;
  tujuan_audit: string;
  tujuan_audit_lainnya?: string;
  deskripsi?: string;
  companies: string;
  created_at?: string;
  updated_at?: string;
}

// Define company data interface
interface CompanyFormData {
  namaEntitas: string;
  bidangUsaha: string;
  alamatPerusahaan: string;
  tahunBuku: string;
  pernahDiaudit: boolean;
  namaKAPSebelumnya?: string;
  opiniKAPSebelumnya?: string;
  jumlahPendapatan: string;
  jumlahAset: string;
}

// Insert client form data dengan error handling untuk missing config
export const insertClientForm = async (formData: {
  personalData: {
    namaLengkap: string;
    nomorHP: string;
    email: string;
  };
  jumlahEntitas: number;
  jasaYangDibutuhkan: string[];
  tujuanAudit: string;
  tujuanAuditLainnya?: string;
  deskripsi?: string;
  companies: CompanyFormData[];
}) => {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        data: null,
        error: 'Supabase configuration is missing. Please check your environment variables.'
      };
    }

    const clientFormData: Omit<ClientFormData, 'id' | 'created_at' | 'updated_at'> = {
      nama_lengkap: formData.personalData.namaLengkap,
      nomor_hp: formData.personalData.nomorHP,
      email: formData.personalData.email,
      jumlah_entitas: formData.jumlahEntitas,
      jasa_yang_dibutuhkan: JSON.stringify(formData.jasaYangDibutuhkan),
      tujuan_audit: formData.tujuanAudit,
      tujuan_audit_lainnya: formData.tujuanAuditLainnya,
      deskripsi: formData.deskripsi,
      companies: JSON.stringify(formData.companies),
    };

    const { data, error } = await supabase
      .from('client_forms')
      .insert([clientFormData])
      .select()
      .single();

    if (error) {
      console.error('Supabase error details:', error);
      
      // If RLS error, provide more helpful message
      if (error.message.includes('row-level security policy')) {
        throw new Error('Database access denied. Please check RLS policies in Supabase dashboard.');
      }
      
      throw new Error(`Database error: ${error.message}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error inserting client form:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Get all client forms dengan error handling
export const getAllClientForms = async () => {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        data: [],
        error: 'Supabase configuration is missing. Please check your environment variables.'
      };
    }

    const { data, error } = await supabase
      .from('client_forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching client forms:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Get client form by ID
export const getClientFormById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('client_forms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching client form:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Types for authentication
export interface UserData {
  id?: string;
  username: string;
  password: string;
  created_at?: string;
}

// Login user function
export const loginUser = async (username: string, password: string) => {
  try {
    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        data: null,
        error: 'Supabase configuration is missing. Please check your environment variables.'
      };
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { 
          data: null, 
          error: 'Username atau password salah' 
        };
      }
      throw new Error(`Database error: ${error.message}`);
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error during login:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Check if user is logged in (by checking localStorage)
export const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('admin_user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Set user session in localStorage
export const setUserSession = (userData: UserData) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_user', JSON.stringify(userData));
  }
};

// Clear user session
export const clearUserSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_user');
  }
};
