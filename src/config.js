export const EVENT = {
  guestOfHonor: 'Megan',
  age: 11,
  themeTitle: 'Fiesta más 80s',
  dateLabel: 'Sábado 16 de mayo',
  timeLabel: '3:30 PM',
  // Ajusta el año si fuera necesario. México centro usa UTC-6.
  dateTime: '2026-05-16T15:30:00-06:00',
  endDateTime: '2026-05-16T20:30:00-06:00',
  venue: 'Salón La Cabaña',
  address: 'Privada de la Fábrica la Trinidad, Cuautepec, Hgo.',
  locationQuery: 'Salón La Cabaña, Privada de la Fábrica la Trinidad, Cuautepec, Hidalgo',
  googleMapsUrl: 'https://maps.app.goo.gl/VDf1YJLtXfjGowVj8',
  dressCode: 'Temática de los 80s',
  hostLine: 'Prepárate para viajar en el tiempo y pasarla increíble.',
  whatsappDisplay: '775 137 2847',
  whatsappPhone: '527751372847',
  rsvpWebhookUrl: import.meta.env.VITE_RSVP_WEBHOOK_URL || '',
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || '',
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    table: import.meta.env.VITE_SUPABASE_TABLE || 'rsvps'
  },
  backgroundMusic: {
    youtubeId: 'djV11Xbc914',
    title: 'Take On Me'
  },
  puzzleImage: '/puzzle-board.svg',
  stickers: [
    '/stickers/rubik.svg',
    '/stickers/cassette.svg',
    '/stickers/boombox.svg',
    '/stickers/sunglasses.svg',
    '/stickers/walkman.svg',
    '/stickers/lightning.svg',
    '/stickers/roller-skate.svg',
    '/stickers/arcade.svg'
  ]
};
