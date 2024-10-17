"use client"; // Client-side rendering
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Updated import
import { signOut } from 'next-auth/react';

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [articlesPerPage] = useState(6); // Set the number of articles per page
    const router = useRouter(); // Using next/navigation router
    const { data: session } = useSession();
    const API_KEY = '488b738fa27a4b8392a4b5e8cc0feb12';
    const URL = `https://newsapi.org/v2/everything?q=${searchQuery || 'apple'}&from=2024-10-15&to=2024-10-15&sortBy=popularity&apiKey=${API_KEY}`;

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get(URL);
                setArticles(response.data.articles);
            } catch (err) {
                setError('Failed to fetch articles.');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [URL]); // Dependency array includes URL to refetch on query change

    // Pagination logic
    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
    
    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalPages = Math.ceil(articles.length / articlesPerPage);
    const paginationNumbers = [...Array(totalPages)].map((_, i) => i + 1);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <>
            <nav className="bg-gray-800 p-4 text-white">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-2xl font-bold">News App</div>
                    <div className="flex items-center space-x-4">
                        <span className="text-white">Welcome, {session?.user?.name}</span>
                        <button
                            onClick={() => signOut()}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto p-4">
                <h1 className="text-3xl font-bold text-center mb-4">Latest News</h1>
                
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border p-2 rounded mb-4 w-full"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentArticles.map((article, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                            {article.urlToImage && (
                                <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <h2 className="font-bold text-xl mb-2">{article.title}</h2>
                                <p className="text-gray-700 mb-4">{article.description}</p>
                                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                    Read more
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    {paginationNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => handlePageChange(number)}
                            className={`mx-1 px-4 py-2 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default News;
