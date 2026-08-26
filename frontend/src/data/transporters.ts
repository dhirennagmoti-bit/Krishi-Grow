export interface Transporter {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export const transporters: Transporter[] = [
  { id: "1", city: "Nashik", name: "OM Sai Ram Logistics", address: "Gat No. 457/458, Near Nanacha Mala, Trimbakeshwar Rd, Satpur", phone: "9764997225", email: "subhash.patil@omsairamlogistics.com" },
  { id: "2", city: "Nashik", name: "HGT Logistics & Transportation", address: "R.H. No. 8, Kamla Park, Jai Bhavani Road", phone: "08788681961 / 09373568155", email: "hgtlogistics@gmail.com" },
  { id: "3", city: "Nashik", name: "Shree Mohta Devi Transport", address: "Gat No. 40/7, Near Panjara Pol, Belgaondhaga", phone: "9527144477", email: "ct.shukla@smdtcl.com" },
  { id: "4", city: "Pune", name: "EasyGo Logistics", address: "Plot 121, Transport Nagar, Nigdi", phone: "7560016001", email: "sales@easygologistics.com" },
  { id: "5", city: "Pune", name: "PRCL", address: "Prestige Plaza, Mumbai-Pune Road, Akurdi", phone: "8655683967", email: "pune@prclimited.co.in" },
  { id: "6", city: "Pune", name: "Metrolink Logistics", address: "Plot 121, Sector 23, Transport Nagar, Nigdi", phone: "9096057151", email: "sales@metrolinklogistics.com" },
  { id: "7", city: "Nagpur", name: "OM Sai Ram Logistics", address: "Plot 2116, Dhobi Nagar, Wardhamna", phone: "9844205577", email: "nagpur@omsairamlogistics.com" },
  { id: "8", city: "Nagpur", name: "PRCL", address: "Sadoday Complex, 77 Central Avenue Extension", phone: "8655683926 / 7558786173", email: "nagpur@prclimited.co.in" },
  { id: "9", city: "Nagpur", name: "AK Mini Transport Services", address: "Nagpur", phone: "7972184572", email: "akathane786@gmail.com" },
  { id: "10", city: "Chhatrapati Sambhajinagar", name: "OM Sai Ram Logistics", address: "Bohra Warehousing, Aurangabad-Pune Highway, Waluj", phone: "9764997229", email: "aurangabad@omsairamlogistics.com" },
  { id: "11", city: "Chhatrapati Sambhajinagar", name: "Seva Logistics", address: "Shop 317, Bakwal Nagar, MIDC, Waluj", phone: "9145684013", email: "info@sevalogistic.in" },
  { id: "12", city: "Chhatrapati Sambhajinagar", name: "Vishvajeet Express", address: "Plot X-107, Ambedkar Chowk, Waluj", phone: "9552514185 / 9422225310", email: "enquiry@vishvajeetexpress.com" },
  { id: "13", city: "Jalgaon", name: "Arco Transport Company", address: "Shripat Udyog Compound, Ajanta Road, MIDC", phone: "0257-2210969 / 2210823", email: "atc.jalgaon@gmail.com" },
  { id: "14", city: "Jalgaon", name: "Vahatukadda", address: "Visanji Nagar, Near Paper King", phone: "9403588862", email: "vahatukadda.jalgaon@gmail.com" },
  { id: "15", city: "Jalgaon", name: "Dexters Logistics", address: "Gat 237, Village Tarsod, Jalgaon Business Park", phone: "8459258397", email: "jalgaon.dexters@gmail.com" },
  { id: "16", city: "Ahmednagar", name: "Vishvajeet Express", address: "Plot P-77, MIDC Area, Behind Bank of Baroda", phone: "9225320306 / 0241-2778096", email: "enquiry@vishvajeetexpress.com" },
  { id: "17", city: "Ahmednagar", name: "Shree Mohta Devi Transport", address: "Nagapur MIDC", phone: "7350010220", email: "ahmednagar@smdtcl.com" },
  { id: "18", city: "Ahmednagar", name: "Bullet Logistics", address: "X-14, Near Manmad Highway, MIDC", phone: "7030936298", email: "ahmednagar@bulletlogistics.in" },
  { id: "19", city: "Kolhapur", name: "Ghatge Patil Transports", address: "Head Office, Kolhapur", phone: "0231-2537915 / 18001219927", email: "enquiries@ghatgegroup.com" },
  { id: "20", city: "Kolhapur", name: "OM Sai Ram Logistics", address: "Kolhapur", phone: "9158883236", email: "kolhapur@omsairamlogistics.com" },
  { id: "21", city: "Kolhapur", name: "Dexters Logistics", address: "Plot 125, Dr. Babasaheb Ambedkar Nagar, Shiroli MIDC", phone: "9764553786", email: "kolhapur@dexters.co.in" },
  { id: "22", city: "Solapur", name: "K P Transports", address: "Furde Trade Centre, Pune-Solapur Highway", phone: "8805980832", email: "solapur@kptransports.com" },
  { id: "23", city: "Solapur", name: "Dexters Logistics", address: "Solapur-Pune Highway, Kondi", phone: "7720856485", email: "solapur@dexters.co.in" },
  { id: "24", city: "Dhule", name: "K P Transports", address: "Plot 18/9, Parola Road, Near Cotton Market", phone: "9421456576", email: "dhule@kptransports.com" },
  { id: "25", city: "Dhule", name: "R K Transport", address: "Behind Gurudwara, NH-03", phone: "07900036111", email: "rktrasport111@gmail.com" },
  { id: "26", city: "Sangli", name: "GE Logistics", address: "G1/G2, Shri Ram Sankul, Behind Ram Mandir", phone: "0233-2329171", email: "connect@gelogistics.in" },
  { id: "27", city: "Sangli", name: "Jayram Transport", address: "Vakhar Bhag, Plot 80, Behind Gandhi Library", phone: "9822209895 / 9370160750", email: "sangli.sgl@jayramtrans.com" },
  { id: "28", city: "Satara", name: "OM Sai Ram Logistics", address: "Shivraj Pump, Pune-Bangalore Highway", phone: "8956179226", email: "satara@omsairamlogistics.com" },
  { id: "29", city: "Satara", name: "Sabale Logistics", address: "Plot A-2/2, Old MIDC", phone: "7249166979", email: "customercaresabalelogistics@gmail.com" }
];
