"use client"; // Ensure client-side rendering
import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Use next/router for client-side routing
import { signOut } from 'next-auth/react';

const News = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { data: session, status } = useSession();
    const router = useRouter();
    const loader = useRef(null);

    const API_KEY = process.env.NEXT_PUBLIC_APIKEY;
    const URL = `https://newsapi.org/v2/everything?q=${searchQuery || 'apple'}&pageSize=6&page=${currentPage}&apiKey=${API_KEY}`;

    useEffect(() => {
        if (typeof window !== 'undefined' && status === 'unauthenticated') {
            router.push('/'); // Redirect to home or login page
        }
    }, [status, router]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await axios.get(URL);
            if (response.data.articles.length === 0) {
                setHasMore(false); // No more articles
            } else {
                setArticles((prevArticles) => [...prevArticles, ...response.data.articles]);
            }
        } catch (err) {
            setError('Failed to fetch articles.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [currentPage, searchQuery]);

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        setArticles([]); // Clear current articles on new search
        setCurrentPage(1); // Reset page number
        setHasMore(true); // Reset hasMore flag
    };

    // Infinite scroll logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setCurrentPage((prevPage) => prevPage + 1); // Load next page
                }
            },
            { threshold: 1 }
        );

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) observer.unobserve(loader.current);
        };
    }, [loading, hasMore]);

    if (status === 'loading') {
        return <div className="text-center">Loading...</div>;
    }

    if (!session) {
        return null; // Optionally display a message for unauthenticated users
    }

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
                    {articles.map((article, index) => (
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

                <div ref={loader} className="text-center mt-4">
                    {loading && <div>Loading more articles...</div>}
                </div>
            </div>
        </>
    );
};

export default News;
