
export const VOLTA = [
    {
        name: "Sacred Heart Hospital - Keta",
        location: "https://goo.gl/maps/waCAPyxbmLN3kjSo9",
    },
    {
        name: "Keta Government Hospital - Keta",
        location: "https://goo.gl/maps/ag7yuQE5PbRgscpw9",
    }
]


// WESTERN REGION
export const WESTERN = [
    {
        name: "Nagel Memorial Hospital",
        location: "https://goo.gl/maps/Xh6bm7pxo1ZR9zjj6",
    },
    {
        name: "Tarkwa Old Government Hospital",
        location:"https://goo.gl/maps/PvdLVz4bbQXjSRRM6"
    }
]


// KUMASI - ASHANTI REGION
export const KUMASI = [
    {
        name: "Manhyia Government Hospital",
        location: "https://goo.gl/maps/fBDyLbeCovKxWfoq5",
    },
    {
        name: "Tafo Hospital, Kumasi Alabama Street",
        location:"https://goo.gl/maps/sLQZAkd5J5S5BaUr7"
    }
]

// EASTERN REGION
export const EASTERN = [
    {
        name: "Holy Family Hospital - Nkawkaw",
        location : "https://goo.gl/maps/GgqUQKZu44bf9xL1A"
    },
    {
        name: "St. Dominic Catholic Church, Koforidua",
        location : 'https://goo.gl/maps/NreJCyT4wKqnQudT9'
    }
]


// NORTHERN REGION
export const NORTHERN = [
    {
        name: "University for Development Studies Hospital",
        location : "https://goo.gl/maps/gqFXdZYa1BF1Q9Se6"
    },
    {
        name: "St. Mary's HospitalSeventh-Day Adventist Hospital",
        location : "https://goo.gl/maps/pWXT1y7i4Xw1jZXW7"
    }
]

// GREATER ACCRA
export const ACCRA = [
    {
        name: "University Hospital - Legon",
        location : "https://goo.gl/maps/SUEEgZbqCkkBTZrx8"
    },
    {
        name: "Korle Bu Teaching Hospital",
        location : "https://goo.gl/maps/nQeQRMed3X2VjBs89"
    }
]

// CENTRAL REGION
export const CENTRAL = [
    {
        name: "Cape Coast Teaching Hospital",
        location : "https://goo.gl/maps/z9BtU5VK3odua7rDA"
    },
    {
        name: "Our Lady of Grace Hospital	",
        location : "https://g.page/OLG-HOSPITAL?share"
    }
]



// BRONG AHAFO REGION
export const BONO = [
    {
        name: "Regional Hospital",
        location: "https://goo.gl/maps/VKnF6fPpMCHvzF256"
    },
    {
        name: "Sunyani SDA Hospital",
        location : "https://goo.gl/maps/eddSvdso1eodGY3c7"
        }
]
  

export type IHOSPITAL = {
    name: string,
    location : string
}
export const HOSPITALS: {
    [key: string]: IHOSPITAL[]
} = {
    "Bono": BONO,
    "Western": WESTERN,
    "Eastern": EASTERN,
    "Central": CENTRAL,
    "Northern": NORTHERN,
    "Greater Accra": ACCRA,
    "Upper East": EASTERN,
    "Upper West": WESTERN,
    "Volta": VOLTA,
    "Ashanti": KUMASI   
}
