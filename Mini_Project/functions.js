import * as fs from "fs";
import {buku} from "./data/buku.js";
import {peminjaman} from "./data/peminjaman.js";

// SHOW menu 
export function tampilkanMenu() {
    console.log(
        "\n==================================\n",
        "      DATABASE PERPUSTAKAAN      \n",
        "=================================\n",
        "1. CREATE\n",
        "2. READ\n",
        "3. UPDATE\n",
        "4. DELETE\n",
        "5. EXIT\n",
        "=================================\n"
    );
}

// SHOW pilihan tabel 
export function tampilkanPilihanTabel() {
    console.log(
        "Pilih data yang ingin digunakan:\n",
        "1. Buku\n",
        "2. Peminjaman\n"
    );
}

// VALIDASI Tahun
export function validasiTahun(tahun) {
    if(isNaN(parseInt(tahun))) {
        return false;
    } else if (tahun.length > 4) {
        return false;
    } else if (parseInt(tahun) < 1970 || parseInt(tahun) > 2040){
        return false;
    } else {
        return true;
    } 
} // OUTPUT false jika tidak valid, true jika valid

// VALIDASI Tanggal
export function validasiTanggal(tanggal) {
    // Cek formatting 
    // \begin{text} $1234$-$12$-$12$ \end{text}
    if (!(/^\d{4}-\d{2}-\d{2}$/.test(tanggal))) {
        return false;
    } else if (isNaN(Date.parse(tanggal))){
        return false;
    } else {
        return true;
    }
}  // OUTPUT false jika tidak valid, true jika valid

// SAVE ke JSON 
export function saveASJSON(pilihan) {

    switch (pilihan) { 
        case "1": // Pilihan 1: simpan tabel/data buku sebagai .json
        fs.writeFileSync(`buku.json`, JSON.stringify(buku, null, 2)); 
        console.log(`Entri/perubahan berhasil disimpan dalam buku.json.`);
        break;

        case "2": // Pilihan 2: simpan tabel/data peminjaman sebagai .json
        fs.writeFileSync(`peminjaman.json`, JSON.stringify(peminjaman, null, 2));
        console.log(`Entri/perubahan berhasil disimpan dalam peminjaman.json.`);    
        break;

        default: // Jika input ambaradul, stop fungsi
        console.log("Pilihan tidak tersedia.");
        break;
    }
}

// LOAD dari JSON 
export function loadFROMJSON(pilihan) {
     
        switch(pilihan) {
            case "1": // Pilihan 1: memuat file buku.json
                if (fs.existsSync("./buku.json")) {
                    const data_buku = fs.readFileSync("buku.json");
                    const isi_buku = JSON.parse(data_buku);
                    buku.splice(0, buku.length, ...isi_buku);
                    console.log("Data buku berhasil dimuat.");
                } else {
                    console.log("File buku.json belum tersedia.");
                    return;
                }
                break; 
            case "2": // Pilihan 2: memuat file peminjaman.json
                if ((fs.existsSync("./peminjaman.json"))) {
                    const data_peminjaman = fs.readFileSync("peminjaman.json");
                    const isi_peminjaman = JSON.parse(data_peminjaman);
                    peminjaman.splice(0, peminjaman.length, ...isi_peminjaman);
                    console.log("Data peminjaman berhasil dimuat.");
                } else {
                    console.log("File peminjaman.js belum tersedia.");
                    return;
                }
                break;
            default: // Jika input ambaradul, stop fungsi
                console.log("Pilihan tidak tersedia.");
                break;
        }
}

// GENERATE kode buku 
export function buatID_buku(kategori) {
    let prefiks = ``; 
    let indeks_ID_terakhir_buku = 0;

    const kata = kategori.trim().split(/\s+/); // Pisah kata menjadi beberapa bagian sesuai dengan spasi dalam sebuah array

    if (kata.length >= 2) { 
        prefiks = (kata[0][0] + kata[1][0]).toUpperCase(); // Kalau jumlah elemen dalam array >= 2, atau ada dua kata atau lebih
    } else {
        prefiks = (kata[0].substring(0, 2).toUpperCase()); // Kalau cuma satu kata, cukup pakai kata itu sendiri
    }

    buku.forEach(entri => {
        if (entri.id_buku && entri.id_buku.startsWith(prefiks)) {
            const indeks_ID_baru_buku = parseInt(entri.id_buku.replace(prefiks, ''), 10);
            if (indeks_ID_baru_buku > indeks_ID_terakhir_buku) {
                indeks_ID_terakhir_buku = indeks_ID_baru_buku; 
            }
        }
    });

    const nomorID_buku = String(indeks_ID_terakhir_buku + 1).padStart(3, `0`);

    return `${prefiks}${nomorID_buku}`;
}

// GENERATE kode peminjaman 
export function buatID_peminjaman() {
    let indeks_ID_terakhir_peminjaman = 0;

    peminjaman.forEach(entri => {
        if(entri.id_peminjaman) {
            const indeks_ID_baru_peminjaman = parseInt(entri.id_peminjaman, 10);
            if (indeks_ID_baru_peminjaman > indeks_ID_terakhir_peminjaman) {
                indeks_ID_terakhir_peminjaman = indeks_ID_baru_peminjaman;
            }
        }
    })

    const nomorID_peminjaman = String(indeks_ID_terakhir_peminjaman + 1).padStart(3, `0`);

    return `${nomorID_peminjaman}`;
}

// CREATE Entri Buku 
export function insertBuku(data) {

    // VALIDASI Input tidak kosong
    if (!data.judul || !data.penulis || !data.kategori || !data.tahun_terbit || !data.stok) {
        console.log("Satu atau beberapa field kosong. Isi ulang.");
        return;
    }

    // VALIDASI Tahun Terbit
    if (!validasiTahun(data.tahun_terbit)) {
        console.log("Format tahun salah, harus YYYY.");
        return;
    }

    // MEMBUAT ID Buku baru jika tidak ada
    if (!data.id_buku || data.id_buku === "") {
        data.id_buku = buatID_buku(data.kategori);
    }

    // MENGECEK ID Buku apakah duplikat
    const id_buku_duplikat = buku.find(b => b.id_buku === data.id_buku);
    if (id_buku_duplikat) {
        console.log(`Entri buku ${data.id_buku} sudah ada.`);
        return;
    }

    // KONVERSI INPUT Stok
    const intStok = parseInt(data.stok);
    data.stok = intStok;

    // INSERT!
    buku.push(data);
    saveASJSON("1");
    console.log(`Entri buku berhasil ditambahkan.`);
};

// CREATE Entri Peminjaman
export function insertPeminjaman(data) {

    // VALIDASI Input tidak kosong
    if (!data.id_buku || !data.nama_peminjam || !data.tanggal_pinjam) {
        console.log("Satu atau beberapa field kosong. Isi ulang.");
        return;
    }

    // VALIDASI Format tanggal peminjaman
    if (!validasiTanggal(data.tanggal_pinjam)) {
        console.log("Masukkan kembali tanggal dengan format YYYY-MM-DD.");
        return;
    }

    // BUAT ID peminjaman baru jika tidak ada
    if(!data.id_peminjaman || data.id_peminjaman === "") {
        data.id_peminjaman = buatID_peminjaman();
    }

    // MEMASTIKAN ID peminjaman unik
    const id_peminjaman_duplikat = peminjaman.find(p => p.id_peminjaman === data.id_peminjaman);
    if (id_peminjaman_duplikat) {
        console.log(`Entri peminjaman ${data.id_peminjaman} sudah ada.`);
        return;
    } 

    // MEMASTIKAN Stok buku yang dipinjam ada
    const indeks_buku_ganti_stok = buku.findIndex(b => b.id_buku === data.id_buku);
    if (buku[indeks_buku_ganti_stok].stok === 0) {
        console.log(`Buku dengan ID ${data.id_buku} habis stoknya. Silahkan pinjam buku yang lain.`);
        return;
    }

    // INSERT
    peminjaman.push(data);

    // Mengurangi stok buku sejumlah 1 karena telah dilakukan peminjaman
    const stok_baru = buku[indeks_buku_ganti_stok].stok - 1;
    buku[indeks_buku_ganti_stok].stok = stok_baru;

    saveASJSON("1");
    saveASJSON("2");
    console.log(`Entri peminjaman berhasil ditambahkan.`);
}

// READ ALL
export function selectALL(pilihan) {
    if (pilihan === "1") {
        console.table(buku);
        return buku;
    } else if (pilihan === "2") {
        console.table(peminjaman);
        return peminjaman;
    } else {
        return;
    }
}

// READ ONE by CODE
export function selectONEbyCODE(pilihan, kode) {
    switch(pilihan) {
        case "1":
            const entri_buku = buku.find(b => b.id_buku === kode);
            if (!entri_buku) {
                console.log(`Entri buku dengan kode ${kode} tidak ditemukan.`);
            } else {
                console.table([entri_buku]);
                return entri_buku;
            }
            break;
        case "2":
            const entri_peminjaman = peminjaman.find(p => p.id_peminjaman === kode); 
            if (!entri_peminjaman) {
                console.log(`Entri peminjaman dengan kode ${kode} tidak ditemukan.`);
            } else {
                console.table([entri_peminjaman]);
                return entri_peminjaman;
            }
            break;
        default:
            console.log("Pilihan tidak ditemukan.");
            break;
    }
}

// READ SOME buku by DATE OF PUBLISHING
export function selectSOMEbyDATE_buku(batas_bawah, batas_atas) {
    if (!batas_bawah || !batas_atas) {
        console.log("Semua batas-batas tahun terbit harus diisi!");
        return;
    }

    if (!validasiTahun(batas_bawah) || !validasiTahun(batas_atas)) {
        console.log("Semua batas-batas tahun terbit harus diisi dengan format YYYY.");
        return;
    }
    
    const tahun_bawah = parseInt(batas_bawah, 10);
    const tahun_atas = parseInt(batas_atas, 10);

    if (batas_bawah === batas_atas) {
        const buku_cocok = buku.filter(b => b.tahun_terbit === tahun_bawah);

        if (buku_cocok.length === 0) {
            console.log(`Tidak ada buku yang terbit pada tahun ${batas_bawah}`);
            return;
        } else {
            console.table(buku_cocok);
            return buku_cocok;
        }
    }
    else {
        const buku_cocok = buku.filter(b => b.tahun_terbit >= tahun_bawah && b.tahun_terbit <= tahun_atas);

        if (buku_cocok.length === 0) {
            console.log(`Tidak ada buku yang terbit di rentang tahun ${batas_bawah} dan ${batas_atas}`);
            return;
        } else {
            console.table(buku_cocok);
            return buku_cocok;
        }
    }
}

// READ SOME peminjaman by DATE
export function selectSOMEbyDATE_peminjaman(jenis_tanggal, batas_bawah, batas_atas) {
    // Validasi keberadaan tanggal
    if (!validasiTanggal(batas_atas) || !validasiTanggal(batas_bawah)) {
        console.log("Format batas-batas tanggal harus YYYY-MM-DD.");
        return;
    }
    
    const tanggal_bawah = new Date(batas_bawah);
    const tanggal_atas = new Date(batas_atas);

    // Validasi rentang tanggal
    if (tanggal_atas < tanggal_bawah) {
        console.log("Rentang tanggal tidak valid.");
        return;
    }
    
    switch(jenis_tanggal) {
        case "1":
            const peminjaman_cocok_tglPinjam = peminjaman.filter(p => {
                if (!p.tanggal_pinjam) return false;

                const tanggal_pinjam_dicek = new Date(p.tanggal_pinjam);

                return (tanggal_pinjam_dicek >= tanggal_bawah && tanggal_pinjam_dicek <= tanggal_atas);
            });

            if (peminjaman_cocok_tglPinjam.length === 0) {
                if (batas_bawah === batas_atas) {
                    console.log(`Tidak ada entri peminjaman dengan tanggal peminjaman ${batas_bawah}.`);
                } else {
                    console.log(`Tidak ada entri peminjaman dengan tanggal peminjaman di rentang ${batas_bawah} dan ${batas_atas}.`);
                }
            } else {
                console.table(peminjaman_cocok_tglPinjam);
                return peminjaman_cocok_tglPinjam;
            }
            break;
        case "2":
            const peminjaman_cocok_tglKembali = peminjaman.filter(p => {
                if (!p.tanggal_kembali) return false;

                const tanggal_kembali_dicek = new Date(p.tanggal_kembali);
                
                return (tanggal_kembali_dicek >= tanggal_bawah && tanggal_kembali_dicek <= tanggal_atas);
            });

            if (peminjaman_cocok_tglKembali.length === 0) {
                if (batas_bawah === batas_atas) {
                    console.log(`Tidak ada entri peminjaman dengan tanggal kembali ${batas_bawah}`);
                } else {
                    console.log(`Tidak ada entri peminjaman dengan tanggal kembali di rentang ${batas_bawah} dan ${batas_atas}.`);
                }
            } else {
                console.table(peminjaman_cocok_tglKembali);
                return peminjaman_cocok_tglKembali;
            }
            break;

        default:
            console.log("Pilihan tidak tersedia.");
            break;
    }
}

// UPDATE ONE
export function updateONE(pilihan, kode, data) {
    switch(pilihan) {
        case "1": // Pilihan UPDATE buku
            const indeks_cocok_buku = buku.findIndex(b => b.id_buku === kode);
            // VALIDASI keberadaan id_buku melalui pencarian indeks
            if (indeks_cocok_buku === -1) {
                console.log(`Entri buku dengan kode ${kode} tidak ditemukan.`);
                return;
            } else { // Pembaharuan data buku
                buku[indeks_cocok_buku] = {...buku[indeks_cocok_buku], 
                    judul        : data.judul !== "" ? data.judul : buku[indeks_cocok_buku].judul,
                    penulis      : data.penulis !== "" ? data.penulis : buku[indeks_cocok_buku].penulis,
                    kategori     : data.kategori !== "" ? data.kategori : buku[indeks_cocok_buku].kategori,
                    tahun_terbit : data.tahun_terbit !== "" ? parseInt(data.tahun_terbit, 10) : buku[indeks_cocok_buku].tahun_terbit,
                    stok         : data.stok !== "" ? parseInt(data.stok, 10) : buku[indeks_cocok_buku].stok
                }
                saveASJSON("1");
                console.log(`Entri buku dengan kode ${kode} berhasil diperbaharui.`);
            }
            break;
        case "2": // Pilihan UPDATE peminjaman
            const indeks_cocok_peminjaman = peminjaman.findIndex(p => p.id_peminjaman === kode);
            // VALIDASI keberadaan id_peminjaman melalui pencarian indeks
            if (indeks_cocok_peminjaman === -1) {
                console.log(`Entri peminjaman dengan kode ${kode} tidak ditemukan.`);
                return;
            } else {
                if (data.id_buku !== peminjaman[indeks_cocok_peminjaman].id_buku) {
                    const indeks_buku_rollback_stok = buku.findIndex(b => b.id_buku === peminjaman[indeks_cocok_peminjaman].id_buku);
                    buku[indeks_buku_rollback_stok].stok++; // Awalnya peminjaman mengurangi stok, di sini rollback pengurangan tersebut
                }

                if (data.tanggal_pinjam !== "") {
                    const indeks_buku_update_stok = buku.findIndex(b => b.id_buku === peminjaman[indeks_cocok_peminjaman].id_buku);
                    buku[indeks_buku_update_stok].stok++; // Menambahkan kembali stok setelah buku dikembalikan
                }
                
                peminjaman[indeks_cocok_peminjaman] = {...peminjaman[indeks_cocok_peminjaman], 
                    id_buku         : data.id_buku !== "" ? data.id_buku : peminjaman[indeks_cocok_peminjaman].id_buku,
                    nama_peminjam   : data.nama_peminjam !== "" ? data.nama_peminjam : peminjaman[indeks_cocok_peminjaman].nama_peminjam,
                    tanggal_pinjam  : data.tanggal_pinjam !== "" ? data.tanggal_pinjam : peminjaman[indeks_cocok_peminjaman].tanggal_pinjam,
                    tanggal_kembali : data.tanggal_kembali !== "" ? data.tanggal_kembali : peminjaman[indeks_cocok_peminjaman].tanggal_kembali
                }
                saveASJSON("1");
                saveASJSON("2");
                console.log(`Entri peminjaman dengan kode ${kode} berhasil diperbaharui.`);
            }
            break;
        default:
            console.log("Pilihan tidak tersedia.");
            break;
        }
}

// DELETE 
export function deleteRECORD(pilihan, kode) {
    switch(pilihan) {
        case "1":
        // VALIDASI ID buku
        const indeks_IDBuku = buku.findIndex(i => i.id_buku === kode);
        if (indeks_IDBuku == -1) {
            console.log(`Buku dengan nomor ID ${kode} tidak ditemukan.`);
            return;
        }

        // DELETE entri buku
        buku.splice(indeks_IDBuku, 1);   
        saveASJSON("1");
        console.log(`Buku dengan nomor identifikasi ${kode} berhasil dihapus.`);
        break;

        case "2":
        // VALIDASI ID peminjaman
        const indeks_IDPeminjaman = peminjaman.findIndex(i => i.id_peminjaman === kode);
        if (indeks_IDPeminjaman == -1) {
            console.log(`Transaksi peminjaman dengan nomor ID ${kode} tidak ditemukan.`);
            return;
        }

        // DELETE entri peminjaman
        peminjaman.splice(indeks_IDPeminjaman, 1);
        saveASJSON("2");
        console.log(`Transaksi peminjaman dengan nomor identifikasi ${kode} berhasil dihapus.`);
        break;

        default:
        console.log(`Pilihan tidak tersedia.`);
        break;
    }
}
