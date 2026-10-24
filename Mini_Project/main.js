import * as readline from "readline";
import {
    tampilkanMenu,                  
    tampilkanPilihanTabel,          
    insertBuku,                     
    insertPeminjaman,               
    selectALL,                      
    selectONEbyCODE,               
    selectSOMEbyDATE_buku,          
    selectSOMEbyDATE_peminjaman,    
    updateONE,                     
    deleteRECORD,                    
    loadFROMJSON
} from "./functions.js";

loadFROMJSON("1");
loadFROMJSON("2");

const rl = readline.createInterface({
  input : process.stdin,
  output: process.stdout,
});

const ask = (questionText) => new Promise((resolve) => rl.question(questionText, resolve));

async function runProgram() {

  tampilkanMenu();

  const query = await ask("Pilih query yang akan dilakukan: ");

  switch(query) {
    case "1": // CREATE 
    {
      tampilkanPilihanTabel();
      const pilihan_data = await ask("Pilih data yang akan digunakan: ");

      if (pilihan_data === "1") {
        const judul = await ask("Masukkan judul buku: ");
        const penulis = await ask("Masukkan penulis buku: ");
        const kategori = await ask("Masukkan kategori buku: ");
        const tahun_terbit = await ask("Masukkan tahun terbit buku (YYYY): ");
        const stok = await ask("Masukkan jumlah stok buku: ");

        insertBuku({
            id_buku: "",
            judul,
            penulis,
            kategori,
            tahun_terbit,
            stok
        });
      } else if (pilihan_data === "2") {
        const id_buku = await ask("Masukkan ID buku yang dipinjam: ");
        const nama_peminjam = await ask("Masukkan nama peminjam: ");
        const tanggal_pinjam = await ask("Masukkan tanggal peminjaman (YYYY-MM-DD): ");
        
        insertPeminjaman({
            id_peminjaman : "",
            id_buku,
            nama_peminjam,
            tanggal_pinjam,
            tanggal_kembali : null
        })
      } else {
        console.log("Pilihan data tidak valid!");
      }
      break;
    }

    case "2": // READ
    {
      tampilkanPilihanTabel();

      const pilihan_data = await ask("Pilih data yang ingin digunakan: ");

      if (pilihan_data === "1") {
        console.log("\nSETUP READ PEMINJAMAN: ");
        console.log("1. READ ALL");
        console.log("2. READ BY CODE");
        console.log("3. READ BY DATE");

        const pilihan_READ = await ask("Pilih setup yang diinginkan: ");
        if (pilihan_READ === "1") {
          console.log("\nDAFTAR DATA BUKU PERPUSTAKAAN");
          selectALL("1");
        } else if (pilihan_READ === "2") {
          const kode = await ask("Masukkan ID buku yang ingin ditampilkan: ");
          selectONEbyCODE("1", kode);
        } else if (pilihan_READ === "3") {
          const batas_bawah = await ask("Masukkan batas bawah tahun terbit: ");
          const batas_atas = await ask("Masukkan batas atas tahun terbit: ");
          selectSOMEbyDATE_buku(batas_bawah, batas_atas);
        } else {
          console.log("Pilihan setup tidak valid!");
        }
      } else if (pilihan_data === "2") {
        console.log("\nSETUP READ BUKU: ");
        console.log("1. READ ALL");
        console.log("2. READ BY CODE");
        console.log("3. READ BY DATE");

        const pilihan_READ = await ask("Pilih setup yang dinginkan: ");
        if (pilihan_READ === "1") {
          console.log("\nDAFTAR ENTRI PEMINJAMAN PERPUSTAKAAN");
          selectALL("2");
        } else if (pilihan_READ === "2") {
          const kode = await ask("Masukkan ID peminjaman yang ingin ditampilkan: ");
          selectONEbyCODE("2", kode);
        } else if (pilihan_READ === "3") {
          console.log("\nSETUP READ BY DATE:");
          console.log("1. DATE OF BORROWING");
          console.log("2. DATE OF RETURN");
          
          const jenis_tanggal = await ask("Pilih setup yang diinginkan: ");
        
          const batas_bawah = await ask("Masukkan batas bawah tanggal (YYYY-MM-DD): ");
          const batas_atas = await ask("Masukkan batas atas tanggal (YYYY-MM-DD): ");

          selectSOMEbyDATE_peminjaman(jenis_tanggal, batas_bawah, batas_atas);
        } else {
          console.log("Pilihan setup tidak valid!");
        }
      } else {
        console.log("Pilihan data tidak valid!");
      }
      break;
    }

    case "3": // UPDATE
    {
      tampilkanPilihanTabel();
      const pilihan_data = await ask("Data mana yang akan digunakan: ");

      if (pilihan_data === "1") {
        const kode = await ask("Pilih ID entri buku yang akan diperbaharui: ");
        console.log("KOSONGKAN DENGAN ENTER JIKA TIDAK INGIN DIGANTI\n");

        const judul = await ask("Masukkan judul baru buku: ");
        const penulis = await ask("Masukkan penulis baru buku: ");
        const kategori = await ask ("Masukkan kategori baru buku: ");
        const tahun_terbit = await ask("Masukkan tahun terbit baru buku: ");
        const stok = await ask("Masukkan jumlah stok baru buku: ");

        updateONE("1", kode, { judul, penulis, kategori, tahun_terbit, stok });

      } else if (pilihan_data === "2") {
        const kode = await ask("Pilih ID entri peminjaman yang akan diperbaharui: ");
        console.log("KOSONGKAN DENGAN ENTER JIKA TIDAK INGIN DIGANTI\n");

        const id_buku = await ask("Masukkan ID buku baru: ");
        const nama_peminjam = await ask("Masukkan nama peminjam baru: ");
        const tanggal_pinjam = await ask("Masukkan tanggal pinjam baru: ");
        const tanggal_kembali = await ask("Masukkan tanggal kembali: ");

        updateONE("2", kode, { id_buku, nama_peminjam, tanggal_pinjam, tanggal_kembali });
      } else {
        console.log("Pilihan data tidak valid!");
      }
      break;  
    }

    case "4":
    {
      tampilkanPilihanTabel();
      const pilihan_data = await ask("Pilih data yang akan digunakan: ");

      if (pilihan_data === "1") {
        const kode = await ask("Masukkan ID entri buku yang ingin dihapus: ");
        deleteRECORD("1", kode);
      } else if (pilihan_data === "2") {
        const kode = await ask("Masukkan ID entri peminjaman yang ingin dihapus: ");
        deleteRECORD("2", kode);
      } else {
        console.log("Pilihan data tidak valid!");
      }
      break;
    }

    case "5":
      console.log("\nSampai jumpa.");
      rl.close();
      return;

    default:
      console.log("Pilih opsi yang tersedia pada menu!");
      break;
  }

  runProgram();
}

runProgram();