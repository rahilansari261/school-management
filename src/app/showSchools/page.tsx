'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, MapPin, Phone, Mail, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  image: string;
  email_id: string;
  created_at: string;
}

export default function ShowSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false); // Separate loading state for search
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const schoolsPerPage = 10;

  // Remove debounced search term - no more auto-search

  // Remove filteredSchools state and filterSchools function as they're no longer needed

  useEffect(() => {
    // Only fetch on initial load or page change, not on search term change
    fetchSchools();
  }, [currentPage]); // Remove searchTerm dependency

  const fetchSchools = async () => {
    try {
      if (searchTerm) {
        setSearching(true); // Show search loading state
      } else {
        setLoading(true); // Show general loading state
      }
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: schoolsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
      });
      
      const response = await fetch(`/api/schools?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSchools(data.schools);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.totalCount);
      } else {
        console.error('Failed to fetch schools');
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchSchools(); // Manually trigger search
  };

  const handleClearSearch = () => {
    setSearchTerm(''); // Clear search term
    setCurrentPage(1); // Reset to first page
    fetchSchools(); // Fetch all schools
  };

  // Remove handleKeyPress since we only want search on button click

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Smart pagination function
  const generatePageNumbers = (currentPage: number, totalPages: number): (number | string)[] => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  // Pagination calculations - now using server-side data
  const startIndex = (currentPage - 1) * schoolsPerPage;
  const endIndex = startIndex + schools.length;

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const goToSpecificPage = (pageInput: string) => {
    const page = parseInt(pageInput);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading || searching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading schools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            All Schools
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Browse and search through all registered schools
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Search Schools</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Find schools by name, address, city, or state.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                {searching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
              <Button
                onClick={handleSearch}
                className="px-6"
                disabled={searching}
              >
                <Search className="w-4 h-4 mr-2" />
                {searching ? 'Searching...' : 'Search'}
              </Button>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={handleClearSearch}
                  disabled={searching}
                  className="px-4"
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            {loading || searching ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                Loading...
              </span>
            ) : (
              `Showing ${schools.length} of ${totalCount} schools (Page ${currentPage} of ${totalPages})`
            )}
          </p>
        </div>

        {/* Schools Grid */}
        {schools.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 dark:text-gray-400">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No schools found</h3>
                <p>Try adjusting your search criteria.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <Card key={school.id} className="overflow-hidden hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                  {school.image ? (
                    <Image
                      src={school.image}
                      alt={school.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                            {school.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm">No Image</p>
                      </div>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-gray-900 dark:text-white line-clamp-2">
                    {school.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {school.address}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{school.city}, {school.state}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{school.contact}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{school.email_id}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Added {formatDate(school.created_at)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-center space-y-4 px-4 sm:px-0">
            {/* Page Info */}
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Page {currentPage} of {totalPages} • Showing {startIndex + 1}-{endIndex} of {totalCount} schools
            </div>
            
            {/* Go to Page Input */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Go to page:</span>
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => goToSpecificPage(e.target.value)}
                className="w-20 h-8 text-center dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-center w-full max-w-sm mx-auto px-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-800 flex-shrink-0"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              {/* Page Numbers with Smart Pagination */}
              <div className="flex items-center space-x-1 mx-2 flex-1 justify-center">
                {generatePageNumbers(currentPage, totalPages).map((page, index) => (
                  <div key={index} className="flex items-center">
                    {page === '...' ? (
                      <span className="px-1 sm:px-2 text-gray-500 dark:text-gray-400">...</span>
                    ) : (
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page as number)}
                        className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm dark:border-gray-600 dark:text-white dark:hover:bg-gray-800 flex-shrink-0"
                      >
                        {page}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-800 flex-shrink-0"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 