// Care symbol data with placeholder SVG images
// These placeholders will be replaced with actual care symbol images later

const careSymbols = [
  // Washing Symbols
  {
    id: 'wash-30',
    category: 'washing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyI+MzDCsDwvdGV4dD48L3N2Zz4=',
    title: 'Machine Wash 30°C',
    shortDescription: 'Wash in washing machine at maximum 30°C (86°F) on normal cycle.'
  },
  {
    id: 'wash-40',
    category: 'washing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI0MCIgeT0iNDUiIGZvbnQtc2l6ZT0iMjQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzMyI+NDDCsDwvdGV4dD48L3N2Zz4=',
    title: 'Machine Wash 40°C',
    shortDescription: 'Wash in washing machine at maximum 40°C (104°F) on normal cycle.'
  },
  {
    id: 'hand-wash',
    category: 'washing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMjUgMzVDMjUgMzAgMzAgMjUgNDAgMjVDNTAgMjUgNTUgMzAgNTUgMzUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJub25lIi8+PHRleHQgeD0iNDAiIHk9IjU1IiBmb250LXNpemU9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMzMzMiPuKciyA8L3RleHQ+PC9zdmc+',
    title: 'Hand Wash Only',
    shortDescription: 'Wash by hand only in water at or below 40°C. Do not machine wash.'
  },
  {
    id: 'no-wash',
    category: 'washing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMTUiIHkxPSIxNSIgeDI9IjY1IiB5Mj0iNjUiIHN0cm9rZT0iI0QzMkYyRiIgc3Ryb2tlLXdpZHRoPSIzIi8+PGxpbmUgeDE9IjY1IiB5MT0iMTUiIHgyPSIxNSIgeTI9IjY1IiBzdHJva2U9IiNEMzJGMkYiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==',
    title: 'Do Not Wash',
    shortDescription: 'Do not wash with water. This item requires special care or dry cleaning only.'
  },
  {
    id: 'delicate-wash',
    category: 'washing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSI1IiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMjUiIHkxPSI1NSIgeDI9IjU1IiB5Mj0iNTUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNDAiIHk9IjQwIiBmb250LXNpemU9IjIwIiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMzMzMiPjMwwrA8L3RleHQ+PC9zdmc+',
    title: 'Delicate Cycle',
    shortDescription: 'Use gentle or delicate cycle at 30°C. Suitable for fragile fabrics.'
  },

  // Drying Symbols
  {
    id: 'tumble-low',
    category: 'drying',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iNDAiIGN5PSI1MCIgcj0iNSIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==',
    title: 'Tumble Dry Low',
    shortDescription: 'Machine dry on low heat or delicate cycle. Use reduced temperature.'
  },
  {
    id: 'line-dry',
    category: 'drying',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIxNSIgeTE9IjE1IiB4Mj0iNjUiIHkyPSIxNSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iNDAiIHkxPSIxNSIgeDI9IjQwIiB5Mj0iNjUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
    title: 'Line Dry',
    shortDescription: 'Hang to dry on a clothesline or drying rack. Do not tumble dry.'
  },
  {
    id: 'no-tumble',
    category: 'drying',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjE1IiB5MT0iMTUiIHgyPSI2NSIgeTI9IjY1IiBzdHJva2U9IiNEMzJGMkYiIHN0cm9rZS13aWR0aD0iMyIvPjxsaW5lIHgxPSI2NSIgeTE9IjE1IiB4Mj0iMTUiIHkyPSI2NSIgc3Ryb2tlPSIjRDMyRjJGIiBzdHJva2Utd2lkdGg9IjMiLz48L3N2Zz4=',
    title: 'Do Not Tumble Dry',
    shortDescription: 'Do not machine dry. Air dry or lay flat to dry instead.'
  },
  {
    id: 'flat-dry',
    category: 'drying',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIGZpbGw9IndoaXRlIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjxsaW5lIHgxPSIxNSIgeTE9IjQwIiB4Mj0iNjUiIHkyPSI0MCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=',
    title: 'Dry Flat',
    shortDescription: 'Lay flat to dry on a horizontal surface. Prevents stretching.'
  },

  // Ironing Symbols
  {
    id: 'iron-low',
    category: 'ironing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMzBMNjAgMzBMNjAgNTBDNjAgNTUgNTUgNjAgNDAgNjBDMjUgNjAgMjAgNTUgMjAgNTBaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSI0MCIgY3k9IjQ1IiByPSIzIiBmaWxsPSIjMzMzIi8+PC9zdmc+',
    title: 'Iron Low Heat',
    shortDescription: 'Iron at low temperature (110°C). Use one dot setting on iron.'
  },
  {
    id: 'iron-medium',
    category: 'ironing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMzBMNjAgMzBMNjAgNTBDNjAgNTUgNTUgNjAgNDAgNjBDMjUgNjAgMjAgNTUgMjAgNTBaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48Y2lyY2xlIGN4PSIzNSIgY3k9IjQ1IiByPSIzIiBmaWxsPSIjMzMzIi8+PGNpcmNsZSBjeD0iNDUiIGN5PSI0NSIgcj0iMyIgZmlsbD0iIzMzMyIvPjwvc3ZnPg==',
    title: 'Iron Medium Heat',
    shortDescription: 'Iron at medium temperature (150°C). Use two dot setting on iron.'
  },
  {
    id: 'no-iron',
    category: 'ironing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMzBMNjAgMzBMNjAgNTBDNjAgNTUgNTUgNjAgNDAgNjBDMjUgNjAgMjAgNTUgMjAgNTBaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48bGluZSB4MT0iMTUiIHkxPSIyMCIgeDI9IjY1IiB5Mj0iNzAiIHN0cm9rZT0iI0QzMkYyRiIgc3Ryb2tlLXdpZHRoPSIzIi8+PGxpbmUgeDE9IjY1IiB5MT0iMjAiIHgyPSIxNSIgeTI9IjcwIiBzdHJva2U9IiNEMzJGMkYiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==',
    title: 'Do Not Iron',
    shortDescription: 'Do not iron. Fabric may be damaged by heat or pressure.'
  },
  {
    id: 'no-steam',
    category: 'ironing',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMzBMNjAgMzBMNjAgNTBDNjAgNTUgNTUgNjAgNDAgNjBDMjUgNjAgMjAgNTUgMjAgNTBaIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjIiLz48dGV4dCB4PSI0MCIgeT0iMjAiIGZvbnQtc2l6ZT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iI0QzMkYyRiI+TzwvdGV4dD48L3N2Zz4=',
    title: 'No Steam Iron',
    shortDescription: 'Iron without steam. Steam may damage the fabric finish.'
  },

  // Dry Cleaning Symbols
  {
    id: 'dry-clean',
    category: 'dry-cleaning',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNDAiIHk9IjUwIiBmb250LXNpemU9IjI4IiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMzMzMiPlA8L3RleHQ+PC9zdmc+',
    title: 'Dry Clean Only',
    shortDescription: 'Professional dry cleaning only. Use perchloroethylene (P) solvent.'
  },
  {
    id: 'no-dry-clean',
    category: 'dry-cleaning',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PGxpbmUgeDE9IjE1IiB5MT0iMTUiIHgyPSI2NSIgeTI9IjY1IiBzdHJva2U9IiNEMzJGMkYiIHN0cm9rZS13aWR0aD0iMyIvPjxsaW5lIHgxPSI2NSIgeTE9IjE1IiB4Mj0iMTUiIHkyPSI2NSIgc3Ryb2tlPSIjRDMyRjJGIiBzdHJva2Utd2lkdGg9IjMiLz48L3N2Zz4=',
    title: 'Do Not Dry Clean',
    shortDescription: 'Do not dry clean. Use alternative cleaning methods only.'
  },
  {
    id: 'gentle-dry-clean',
    category: 'dry-cleaning',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzNSIgZmlsbD0id2hpdGUiIHN0cm9rZT0iIzMzMyIgc3Ryb2tlLXdpZHRoPSIyIi8+PHRleHQgeD0iNDAiIHk9IjUwIiBmb250LXNpemU9IjI4IiBmb250LWZhbWlseT0iQXJpYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiMzMzMiPkY8L3RleHQ+PGxpbmUgeDE9IjI1IiB5MT0iNjAiIHgyPSI1NSIgeTI9IjYwIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIvPjwvc3ZnPg==',
    title: 'Gentle Dry Clean',
    shortDescription: 'Professional dry cleaning with gentle cycle. Use petroleum (F) solvent.'
  }
];

export default careSymbols;
