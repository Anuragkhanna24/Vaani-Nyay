import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCase } from '../services/caseService';
import { FiArrowLeft, FiPlus, FiFileText, FiType, FiAlignLeft } from 'react-icons/fi';

const NewCasePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    caseId: '',
    applicationType: 'Property Dispute',
    description: '',
    priority: 'Medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const applicationTypes = [
    'Property Dispute',
    'Domestic Violence',
    'Land Ownership',
    'Legal Aid',
    'Other'
  ];

  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.caseId) {
      setError('Title and Case ID are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await createCase(formData);
      navigate('/track-cases');
    } catch (err) {
      console.error('Error creating case:', err);
      setError(err.response?.data?.error || 'Failed to create case');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141E28] text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#33FEBF] hover:text-opacity-80 mb-6 transition"
        >
          <FiArrowLeft className="mr-2" /> Back to Cases
        </button>

        <div className="flex items-center mb-6">
          <FiPlus className="text-2xl text-[#33FEBF] mr-3" />
          <h1 className="text-2xl md:text-3xl font-bold">Create New Case</h1>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-4 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white bg-opacity-5 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-10">
          <div className="mb-6">
            <label htmlFor="title" className="block text-[#33FEBF] mb-2 flex items-center">
              <FiType className="mr-2" /> Case Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#33FEBF] text-white placeholder-gray-400"
              placeholder="e.g., Property dispute with neighbor"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="caseId" className="block text-[#33FEBF] mb-2 flex items-center">
              <FiFileText className="mr-2" /> Case ID
            </label>
            <input
              type="text"
              id="caseId"
              name="caseId"
              value={formData.caseId}
              onChange={handleChange}
              required
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#33FEBF] text-white placeholder-gray-400"
              placeholder="e.g., VNC-2023-001"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="applicationType" className="block text-[#33FEBF] mb-2">
                Application Type
              </label>
              <select
                id="applicationType"
                name="applicationType"
                value={formData.applicationType}
                onChange={handleChange}
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#33FEBF] text-white"
              >
                {applicationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-[#33FEBF] mb-2">
                Priority Level
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#33FEBF] text-white"
              >
                {priorities.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-[#33FEBF] mb-2 flex items-center">
              <FiAlignLeft className="mr-2" /> Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#33FEBF] text-white placeholder-gray-400"
              placeholder="Provide details about your case..."
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#33FEBF] text-[#141E28] px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#141E28]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                <>
                  <FiPlus className="mr-2" /> Create Case
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 bg-gradient-to-r from-[#33FEBF] to-[#1E90FF] rounded-xl p-6 text-[#141E28]">
          <h2 className="text-xl font-bold mb-2">Need Help Filing Your Case?</h2>
          <p className="mb-4">Our legal experts can guide you through the process and ensure your application is complete.</p>
          <button className="bg-[#141E28] text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition">
            Contact Legal Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCasePage;