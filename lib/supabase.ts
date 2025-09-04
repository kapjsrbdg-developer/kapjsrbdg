import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our client form data
export interface ClientFormData {
  id?: string;
  nama_lengkap: string;
  nomor_hp: string;
  email: string;
  jumlah_entitas: number;
  jasa_yang_dibutuhkan: string;
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

// Insert client form data with RLS bypass for public access
export const insertClientForm = async (formData: {
  personalData: {
    namaLengkap: string;
    nomorHP: string;
    email: string;
  };
  jumlahEntitas: number;
  jasaYangDibutuhkan: string[];
  companies: CompanyFormData[];
}) => {
  try {
    const clientFormData: Omit<ClientFormData, 'id' | 'created_at' | 'updated_at'> = {
      nama_lengkap: formData.personalData.namaLengkap,
      nomor_hp: formData.personalData.nomorHP,
      email: formData.personalData.email,
      jumlah_entitas: formData.jumlahEntitas,
      jasa_yang_dibutuhkan: JSON.stringify(formData.jasaYangDibutuhkan),
      companies: JSON.stringify(formData.companies),
    };

    // Try with anon key first
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

// Get all client forms (for admin)
export const getAllClientForms = async () => {
  try {
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
