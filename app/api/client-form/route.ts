import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

type ClientFormFromDB = {
  id: string;
  namaLengkap: string;
  nomorHP: string;
  email: string;
  jumlahEntitas: number;
  jasaYangDibutuhkan: string;
  companies: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      personalData,
      jumlahEntitas,
      jasaYangDibutuhkan,
      companies
    } = body;

    // Validasi data
    if (!personalData?.namaLengkap || !personalData?.nomorHP || !personalData?.email) {
      return NextResponse.json(
        { error: 'Data diri tidak lengkap' },
        { status: 400 }
      );
    }

    if (!jumlahEntitas || !jasaYangDibutuhkan || !companies) {
      return NextResponse.json(
        { error: 'Data kebutuhan tidak lengkap' },
        { status: 400 }
      );
    }

    // Simpan ke database
    const clientForm = await prisma.clientForm.create({
      data: {
        namaLengkap: personalData.namaLengkap,
        nomorHP: personalData.nomorHP,
        email: personalData.email,
        jumlahEntitas: parseInt(jumlahEntitas),
        jasaYangDibutuhkan: JSON.stringify(jasaYangDibutuhkan),
        companies: JSON.stringify(companies),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Form berhasil disimpan!',
      id: clientForm.id
    });

  } catch (error) {
    console.error('Error saving form:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat menyimpan data' },
      { status: 500 }
    );
  }
}

// GET endpoint untuk mengambil semua data form (untuk admin)
export async function GET() {
  try {
    const forms = await prisma.clientForm.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse JSON fields untuk response
    const formsWithParsedData = forms.map((form: ClientFormFromDB) => ({
      ...form,
      jasaYangDibutuhkan: JSON.parse(form.jasaYangDibutuhkan),
      companies: JSON.parse(form.companies)
    }));

    return NextResponse.json(formsWithParsedData);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil data' },
      { status: 500 }
    );
  }
}
