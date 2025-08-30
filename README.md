# Query Hub - CSV Data Analysis Platform

A modern Next.js 14 application that allows users to upload CSV files, build complex queries, and visualize data with interactive charts. Built with TypeScript, MongoDB, and Recharts.

## Features

- **CSV Upload & Processing**: Drag-and-drop CSV file uploads with automatic parsing and MongoDB storage
- **Query Builder**: Visual query builder with filters, grouping, aggregations, and sorting
- **MongoDB Integration**: Direct MongoDB aggregation pipeline generation and execution
- **Data Visualization**: Interactive charts using Recharts (bar, line, pie, area charts)
- **File Management**: Browse uploaded files, view metadata, and manage data sources
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Database**: MongoDB with official Node.js driver
- **File Storage**: Supabase Storage (configurable for AWS S3)
- **CSV Parsing**: fast-csv for efficient CSV processing
- **Icons**: Lucide React

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

## Roadmap

- [ ] Real-time data updates
- [ ] Advanced chart customization
- [ ] Data export in multiple formats
- [ ] User authentication and data isolation
- [ ] Scheduled queries and reports
- [ ] API rate limiting and caching
- [ ] Mobile-responsive design improvements
