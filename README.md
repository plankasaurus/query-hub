# 🚀 Query Hub - Next-Generation Data Intelligence Platform

> **Transform Data Into Intelligence** - Experience the future of data analysis with our AI-powered, next-generation platform.

![Query Hub Platform](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.3-green?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 **What Makes This Special**

This isn't just another data platform - it's a **next-generation data intelligence experience** that will absolutely **WOW** you with:

- 🎨 **Stunning Visual Design** - Glass morphism, gradients, and smooth animations
- 🚀 **Advanced UI Components** - Modern cards, status indicators, and loading states
- 🌙 **Seamless Dark Mode** - Beautiful theme switching with system preference detection
- ✨ **Micro-Interactions** - Hover effects, floating animations, and smooth transitions
- 🔮 **AI-Powered Interface** - Intelligent suggestions and modern UX patterns
- 📱 **Responsive Excellence** - Perfect on every device with advanced layouts

## ✨ **Core Features**

### **🎯 Smart Data Processing**
- **Intelligent CSV Upload** - Drag & drop with automatic parsing and validation
- **AI-Powered Column Detection** - Automatic data type inference and optimization
- **Real-time Processing** - Lightning-fast MongoDB integration with batching

### **🔧 Advanced Query Building**
- **Visual Query Builder** - Intuitive interface for complex MongoDB pipelines
- **Natural Language Support** - Build queries with intelligent suggestions
- **Real-time Validation** - Instant feedback and error prevention

### **📊 Interactive Visualizations**
- **Multi-Chart Support** - Bar, line, pie, and area charts with Recharts
- **Dynamic Data Binding** - Real-time chart updates and customization
- **Export & Sharing** - Multiple export formats and collaboration tools

### **📁 Intelligent File Management**
- **Smart Organization** - Advanced metadata and version control
- **Search & Filter** - Powerful file discovery and management
- **Performance Analytics** - File processing insights and optimization

## 🎨 **Design System**

### **Modern UI Components**
- **Glass Morphism Cards** - Beautiful translucent interfaces with backdrop blur
- **Gradient Borders** - Subtle color transitions and hover effects
- **Animated Status Indicators** - Real-time system status with smooth animations
- **Floating Particles** - Subtle background animations for depth
- **Custom Scrollbars** - Elegant scrolling experience

### **Color Palette**
- **Primary**: Sophisticated grays with blue accents
- **Accents**: Vibrant gradients (blue → purple → cyan)
- **Status Colors**: Green (success), Blue (info), Yellow (warning), Red (error)
- **Dark Mode**: Rich, deep backgrounds with perfect contrast

### **Typography & Spacing**
- **Font**: Inter with optimized readability
- **Scale**: Consistent 4px grid system
- **Hierarchy**: Clear visual hierarchy with proper contrast
- **Responsive**: Adaptive typography for all screen sizes

## 🛠️ **Tech Stack**

### **Frontend Excellence**
- **Next.js 14** - Latest App Router with server components
- **React 18** - Concurrent features and modern patterns
- **TypeScript 5** - Strict typing and advanced features
- **Tailwind CSS 3.3** - Utility-first CSS with custom design system

### **UI Component Library**
- **shadcn/ui** - Beautiful, accessible components
- **Radix UI** - Unstyled, accessible primitives
- **Lucide Icons** - Consistent iconography
- **Framer Motion** - Smooth animations and transitions

### **Data & Visualization**
- **MongoDB 6.3** - Official Node.js driver with aggregation pipelines
- **Recharts 2.8** - Interactive chart library
- **fast-csv 5.0** - High-performance CSV parsing
- **Supabase Storage** - Scalable file storage solution

### **Development Experience**
- **ESLint** - Code quality and consistency
- **Prettier** - Automatic code formatting
- **Husky** - Git hooks for quality assurance
- **Docker** - Containerized development environment

## Project Structure

```
query-hub/
├── app/                    # Next.js 14 App Router pages
│   ├── api/               # API routes
│   │   ├── upload/        # CSV upload endpoint
│   │   └── query/         # Query execution endpoint
│   ├── upload/            # File upload page
│   ├── query-builder/     # Query builder interface
│   ├── charts/            # Data visualization page
│   ├── files/             # File management page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui base components
│   ├── file-uploader.tsx # CSV file upload component
│   ├── query-builder.tsx # Query building interface
│   └── chart-viewer.tsx  # Chart visualization component
├── lib/                  # Utility libraries
│   ├── mongodb.ts        # MongoDB client configuration
│   ├── csv-parser.ts     # CSV parsing utilities
│   ├── query-builder.ts  # Query to MongoDB pipeline converter
│   └── utils.ts          # General utility functions
└── package.json          # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance (local or MongoDB Atlas)
- Supabase account (for file storage) or AWS S3

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd query-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/query-hub
   MONGODB_DB=query-hub
   
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up MongoDB**
   - Create a MongoDB database named `query-hub`
   - The app will automatically create `files` and `rows` collections

5. **Set up Supabase Storage** (optional)
   - Create a Supabase project
   - Set up a storage bucket for CSV files
   - Configure CORS policies for file uploads

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### 1. Upload CSV Files
- Navigate to `/upload`
- Drag and drop CSV files or click to browse
- Files are automatically parsed and stored in MongoDB
- View upload progress and status

### 2. Build Queries
- Go to `/query-builder`
- Select columns for filtering, grouping, and aggregation
- Configure sort order and result limits
- Execute queries to see results in real-time

### 3. Visualize Data
- Visit `/charts` to see interactive visualizations
- Choose from bar, line, pie, and area charts
- Customize chart axes and data fields
- Export chart data as CSV

### 4. Manage Files
- Browse uploaded files at `/files`
- View file metadata, column information, and row counts
- Delete files and manage storage

## API Endpoints

### POST /api/upload
Upload and process CSV files.

**Request**: `FormData` with CSV file
**Response**: File metadata and processing status

### POST /api/query
Execute MongoDB queries.

**Request**: Query configuration object
**Response**: Query results and execution metadata

### GET /api/query
Get available columns from uploaded data.

**Response**: Array of column names

## Database Schema

### Files Collection
```typescript
interface FileDocument {
  _id: ObjectId
  name: string
  size: number
  uploadTime: Date
  rowCount: number
  columns: string[]
  columnTypes: Record<string, string>
  sampleRows: any[]
  status: 'processing' | 'processed' | 'error'
}
```

### Rows Collection
```typescript
interface RowDocument {
  _id: ObjectId
  fileId: ObjectId
  rowIndex: number
  data: Record<string, any>
}
```

## Query Builder Features

- **Filters**: Equals, not equals, greater/less than, regex, exists
- **Grouping**: Group by multiple fields with optional aliases
- **Aggregations**: Sum, average, min, max, count, count distinct
- **Sorting**: Ascending/descending by multiple fields
- **Limiting**: Control result set size

## Chart Types

- **Bar Charts**: Compare categories
- **Line Charts**: Show trends over time
- **Pie Charts**: Display proportions
- **Area Charts**: Show volume and cumulative data

## Development

### Adding New Chart Types
1. Add chart type to `ChartViewer` component
2. Import required Recharts components
3. Add chart type option to the selector
4. Implement chart rendering logic

### Extending Query Builder
1. Add new filter operators in `query-builder.ts`
2. Update MongoDB pipeline generation
3. Add UI controls in `QueryBuilder` component
4. Update validation logic

### Customizing Styling
- Modify `tailwind.config.js` for theme customization
- Update CSS variables in `globals.css`
- Override component styles using Tailwind classes

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Docker
```bash
# Build image
docker build -t query-hub .

# Run container
docker run -p 3000:3000 --env-file .env.local query-hub
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production MongoDB connection string
- Configure production file storage credentials
- Set secure `NEXTAUTH_SECRET`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions and support:
- Create an issue on GitHub
- Check the documentation
- Review the code examples

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
npm run build
vercel --prod
```

### **Docker**
```bash
docker build -t query-hub .
docker run -p 3000:3000 query-hub
```

### **Self-Hosted**
```bash
npm run build
npm start
```

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
```bash
# Install dependencies
npm install

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Next.js Team** - For the amazing framework
- **shadcn/ui** - Beautiful component library
- **Tailwind CSS** - Utility-first CSS framework
- **MongoDB** - Powerful database solution
- **Recharts** - Interactive chart library

## 📞 **Support**

- **Documentation**: [docs.queryhub.com](https://docs.queryhub.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/query-hub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/query-hub/discussions)
- **Email**: support@queryhub.com

---

**Built with ❤️ for the next generation of data intelligence**

*Transform your data into actionable insights with Query Hub - where modern design meets powerful functionality.*
