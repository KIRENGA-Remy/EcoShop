import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  pages: number;
  page: number;
  keyword?: string;
}

const Pagination: React.FC<PaginationProps> = ({ pages, page, keyword = '' }) => {
  if (pages <= 1) {
    return null;
  }

  const getPageLink = (pageNumber: number) => {
    return keyword
      ? `/search/${keyword}/page/${pageNumber}`
      : `/page/${pageNumber}`;
  };

  return (
    <div className="flex justify-center mt-8">
      <nav className="flex space-x-1" aria-label="Pagination">
        {/* Previous page */}
        {page > 1 && (
          <Link
            to={getPageLink(page - 1)}
            className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </Link>
        )}

        {/* Page numbers */}
        {[...Array(pages).keys()].map((p) => {
          const pageNumber = p + 1;
          
          // Show current page, first, last, and pages close to current
          if (
            pageNumber === 1 ||
            pageNumber === pages ||
            (pageNumber >= page - 1 && pageNumber <= page + 1)
          ) {
            return (
              <Link
                key={pageNumber}
                to={getPageLink(pageNumber)}
                className={`px-4 py-2 rounded-md ${
                  pageNumber === page
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </Link>
            );
          }
          
          // Show ellipsis
          if (pageNumber === page - 2 || pageNumber === page + 2) {
            return (
              <span
                key={pageNumber}
                className="px-4 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }
          
          return null;
        })}

        {/* Next page */}
        {page < pages && (
          <Link
            to={getPageLink(page + 1)}
            className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <span className="sr-only">Next</span>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Pagination;