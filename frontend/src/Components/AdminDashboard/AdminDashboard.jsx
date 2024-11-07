import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import './AdminDashboard.css';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

const AdminDashboard = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [boxes, setBoxes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newBox, setNewBox] = useState({
        name: '',
        title: '',
        initials: '',
        twitter: '',
        telegram: '',
        website: '',
        category: 'Ecosystem projects',
        address: '',
        is_pinned: false,
        background_image: '',
        text_color: 'black',
        description: '',
    });
    const [error, setError] = useState('');

    const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = localStorage.getItem('admin_authenticated');
            if (isAuth === 'true') {
                setIsAuthenticated(true);
                fetchBoxes();
            } else {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const fetchBoxes = async () => {
        try {
            const { data, error } = await supabase.from('complaint_boxes').select('*');
            if (error) throw error;
            setBoxes(data || []);
        } catch (error) {
            toast.error('Error fetching boxes: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem('admin_authenticated', 'true');
            setError('');
            fetchBoxes();
            toast.success('Successfully logged in');
        } else {
            setError('Invalid password');
            toast.error('Invalid password');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_authenticated');
        toast.success('Successfully logged out');
    };

    const handleAddBox = async (e) => {
        e.preventDefault();
        try {
            if (!newBox.name || !newBox.address) {
                throw new Error('Name and address are required');
            }

            // Generate slug from name
            const slug = newBox.name.toLowerCase().replace(/\s+/g, '');

            // Generate default background image path if not provided
            const background_image = newBox.background_image ||
                (slug === 'jesse' ? '/card.png' : `/card_${slug}.png`);

            const boxToInsert = {
                ...newBox,
                slug,
                background_image,
                // Ensure all required fields are present
                text_color: newBox.text_color || 'black',
                description: newBox.description || `Welcome to Complain Onchain, darling! If you have a complaint or feedback for ${newBox.name}, please feel free to write it below and it will get sent directly onchain.`,
            };

            const { error } = await supabase
                .from('complaint_boxes')
                .insert([boxToInsert]);

            if (error) throw error;

            toast.success('Box added successfully');
            setNewBox({
                name: '',
                title: '',
                initials: '',
                twitter: '',
                telegram: '',
                website: '',
                category: 'Ecosystem projects',
                address: '',
                is_pinned: false,
                background_image: '',
                text_color: 'black',
                description: '',
            });
            fetchBoxes();
        } catch (error) {
            toast.error(error.message);
            setError(error.message);
        }
    };

    const handleDeleteBox = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                const { error } = await supabase
                    .from('complaint_boxes')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                toast.success('Box deleted successfully');
                fetchBoxes();
            } catch (error) {
                toast.error('Error deleting box: ' + error.message);
            }
        }
    };

    if (isLoading) {
        return (
            <div className="content">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="content">
                    <Toaster position="top-center" />
                    <div className="login-container">
                        <h2 className="login-title">Admin Login</h2>
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="admin-input-group">
                                <label className="admin-input-label">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="admin-input"
                                />
                                {error && <div className="admin-error">{error}</div>}
                            </div>
                            <button type="submit" className="admin-button admin-button-primary">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="content">
                <Toaster position="top-center" />
                <div className="admin-page">
                    <div className="admin-header">
                        <h2 className="page-title">Admin Dashboard</h2>
                        <button onClick={handleLogout} className="admin-button admin-button-ghost">
                            Logout
                        </button>
                    </div>
                    <div className="admin-grid">
                        <div className="admin-card">
                            <h3 className="admin-card-title">Add New Complaint Box</h3>
                            <form onSubmit={handleAddBox} className="admin-form">
                                <div className="admin-input-group">
                                    <label className="admin-input-label">Name</label>
                                    <input
                                        type="text"
                                        value={newBox.name}
                                        onChange={(e) => setNewBox({ ...newBox, name: e.target.value })}
                                        placeholder="Name"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-input-group">
                                    <label className="admin-input-label">Title</label>
                                    <input
                                        type="text"
                                        value={newBox.title}
                                        onChange={(e) => setNewBox({ ...newBox, title: e.target.value })}
                                        placeholder="Title"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-input-group">
                                    <label className="admin-input-label">Initials</label>
                                    <input
                                        type="text"
                                        value={newBox.initials}
                                        onChange={(e) => setNewBox({ ...newBox, initials: e.target.value })}
                                        placeholder="Initials"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-input-group">
                                    <label className="admin-input-label">Twitter Handle</label>
                                    <input
                                        type="text"
                                        value={newBox.twitter}
                                        onChange={(e) => setNewBox({ ...newBox, twitter: e.target.value })}
                                        placeholder="Twitter handle without @"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-input-group">
                                    <label className="admin-input-label">Telegram Handle</label>
                                    <input
                                        type="text"
                                        value={newBox.telegram}
                                        onChange={(e) => setNewBox({ ...newBox, telegram: e.target.value })}
                                        placeholder="Telegram handle without @"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-input-group">
                                    <label className="admin-input-label">Wallet Address</label>
                                    <input
                                        type="text"
                                        value={newBox.address}
                                        onChange={(e) => setNewBox({ ...newBox, address: e.target.value })}
                                        placeholder="0x..."
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-input-group">
                                    <label className="admin-input-label">Category</label>
                                    <select
                                        value={newBox.category}
                                        onChange={(e) => setNewBox({ ...newBox, category: e.target.value })}
                                        className="admin-select"
                                    >
                                        <option value="Ecosystem projects">Ecosystem projects</option>
                                        <option value="Communities">Communities</option>
                                        <option value="Influencers">Influencers</option>
                                    </select>
                                </div>

                                <div className="admin-input-group">
                                    <label className="admin-input-label">Website</label>
                                    <input
                                        type="text"
                                        value={newBox.website}
                                        onChange={(e) => setNewBox({ ...newBox, website: e.target.value })}
                                        placeholder="https://..."
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-input-group">
                                    <label className="admin-input-label">Background Image Path</label>
                                    <input
                                        type="text"
                                        value={newBox.background_image}
                                        onChange={(e) => setNewBox({ ...newBox, background_image: e.target.value })}
                                        placeholder="Leave blank for default path (/card_name.png)"
                                        className="admin-input"
                                    />
                                </div>

                                <div className="admin-input-group">
                                    <label className="admin-input-label">Text Color</label>
                                    <select
                                        value={newBox.text_color}
                                        onChange={(e) => setNewBox({ ...newBox, text_color: e.target.value })}
                                        className="admin-select"
                                    >
                                        <option value="black">Black</option>
                                        <option value="white">White</option>
                                    </select>
                                </div>

                                <div className="admin-input-group">
                                    <label className="admin-input-label">Description</label>
                                    <textarea
                                        value={newBox.description}
                                        onChange={(e) => setNewBox({ ...newBox, description: e.target.value })}
                                        placeholder="Leave blank for default description"
                                        className="admin-textarea"
                                        rows={4}
                                    />
                                </div>

                                <div className="admin-checkbox-group">
                                    <label className="admin-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={newBox.is_pinned}
                                            onChange={(e) => setNewBox({ ...newBox, is_pinned: e.target.checked })}
                                            className="admin-checkbox"
                                        />
                                        Pin to top of homepage
                                    </label>
                                </div>

                                {error && <div className="admin-error">{error}</div>}

                                <button type="submit" className="admin-button admin-button-primary">
                                    Add Box
                                </button>
                            </form>
                        </div>

                        <div className="admin-card">
                            <h3 className="admin-card-title">Existing Complaint Boxes</h3>
                            <div className="boxes-list">
                                {boxes.map((box) => (
                                    <div key={box.id} className="box-item">
                                        <div className="box-info">
                                            <div className="box-name">{box.name}</div>
                                            <div className="box-details">
                                                <span className="box-category">{box.category}</span>
                                                {box.is_pinned && <span className="box-pinned">Pinned</span>}
                                            </div>
                                            <div className="box-address">{box.address}</div>
                                            {box.text_color && <div className="box-text-color">Text: {box.text_color}</div>}
                                            {box.background_image && <div className="box-bg-image">Image: {box.background_image}</div>}
                                        </div>
                                        <button
                                            onClick={() => handleDeleteBox(box.id, box.name)}
                                            className="delete-button"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                                {boxes.length === 0 && (
                                    <div className="no-boxes">No complaint boxes found</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AdminDashboard;