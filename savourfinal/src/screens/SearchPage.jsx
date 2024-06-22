import React, { useState } from 'react';
import {Link} from "react-router-dom";

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const { id, email } = JSON.parse(localStorage.getItem("user"));

    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ searchItem: searchTerm }),
            });
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search for restaurants or dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>Search</button>
            </div>
            <div className="card">
                <div className="card-body">
                    {searchResults.map((result) => (
                      < Link to={result.vendorDetails._id !== id ?"/user/profile/"+result.vendorDetails._id : "/user/profile" }>
                        <div key={result.menuItem._id} className="result-item">
                            <h5 className="card-title">{result.menuItem.item}</h5>
                            <h6 className="card-subtitle mb-2 text-muted">Shop: {result.vendorDetails.shopName}</h6>
                            <p className="card-text">Price: {result.menuItem.price}</p>
                            <p className="card-text">Location: {result.vendorDetails.location}</p>
                            <p className="card-text">Category: {result.menuItem.category}</p>
                        </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
