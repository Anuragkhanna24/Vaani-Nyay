// src/pages/TrackCasePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCases } from '../services/caseService';
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronRight,
  FiPlus,
  FiFileText,
  FiUser,
  FiCalendar,
  FiMessageSquare
} from 'react-icons/fi';

const TrackCasePage = () => {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      const data = await fetchCases();
      setCases(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await fetchCases(searchTerm);
      setCases(data);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCases = cases.filter(caseItem => {
    if (activeTab === 'all') return true;
    return caseItem.status === activeTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
      case 'Closed':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'Documentation Required':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
      case 'Closed':
        return <FiCheckCircle className="text-green-500" />;
      case 'Under Review':
        return <FiClock className="text-blue-500" />;
      case 'Documentation Required':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'Rejected':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCaseId = (caseId) => {
    if (!caseId) return 'N/A';
    return `VNC-${caseId.substring(0, 4)}-${caseId.substring(4)}`;
  };

  return (
    <div className="min-h-screen bg-[#141E28] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">Track Your Cases</h1>
            <p className="text-[#33FEBF]">Monitor the progress of your legal applications</p>
          </div>
          <button
            onClick={() => navigate('/new-case')}
            className="mt-4 md:mt-0 bg-[#33FEBF] text-[#141E28] px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center"
          >
            <FiPlus className="mr-2" /> New Application
          </button>
        </div>

        {/* Search Section */}
        <div className="bg-white bg-opacity-10 rounded-xl p-6 mb-8 backdrop-blur-sm border border-white border-opacity-20">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#33FEBF]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Case ID or Title"
                className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#33FEBF] text-white placeholder-gray-300"
              />
            </div>
            <button
              type="submit"
              className="bg-[#33FEBF] text-[#141E28] px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition flex items-center justify-center"
            >
              <FiSearch className="mr-2" /> Search
            </button>
          </form>
        </div>

        {/* Status Tabs */}
        <div className="flex overflow-x-auto mb-6 pb-2 scrollbar-hide">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap ${
              activeTab === 'all' ? 'bg-[#33FEBF] text-[#141E28]' : 'bg-white bg-opacity-10 hover:bg-opacity-20'
            }`}
          >
            All Cases
          </button>
          {['Pending', 'Under Review', 'Documentation Required', 'Approved', 'Closed', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveTab(status)}
              className={`px-4 py-2 rounded-lg mr-2 whitespace-nowrap flex items-center ${
                activeTab === status ? 'bg-[#33FEBF] text-[#141E28]' : 'bg-white bg-opacity-10 hover:bg-opacity-20'
              }`}
            >
              {getStatusIcon(status)}
              <span className="ml-2">{status}</span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#33FEBF]"></div>
          </div>
        )}

        {/* Cases List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredCases.length === 0 ? (
              <div className="bg-white bg-opacity-10 rounded-xl p-8 text-center backdrop-blur-sm border border-white border-opacity-20">
                <p className="text-gray-300 mb-4">No cases found matching your criteria</p>
                <button
                  onClick={() => navigate('/new-case')}
                  className="bg-[#33FEBF] text-[#141E28] px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition"
                >
                  Start New Application
                </button>
              </div>
            ) : (
              filteredCases.map((caseItem) => (
                <div
                  key={caseItem._id}
                  className="bg-white bg-opacity-5 rounded-xl p-6 hover:bg-opacity-10 transition cursor-pointer backdrop-blur-sm border border-white border-opacity-10 hover:border-opacity-20"
                  onClick={() => navigate(`/cases/${caseItem._id}`)}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div className="mb-4 md:mb-0">
                      <h3 className="font-bold text-lg text-white mb-1">{caseItem.title}</h3>
                      <p className="text-[#33FEBF] text-sm flex items-center">
                        <FiFileText className="mr-1" /> {formatCaseId(caseItem.caseId)}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                      <p className="text-gray-300 text-sm mt-2">
                        <FiCalendar className="inline mr-1" /> Created: {formatDate(caseItem.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center">
                        <div className="flex-1 bg-white bg-opacity-20 rounded-full h-2.5 mr-4">
                          <div
                            className={`h-2.5 rounded-full ${
                              caseItem.progress === 100
                                ? 'bg-green-500'
                                : caseItem.progress > 50
                                ? 'bg-blue-500'
                                : caseItem.progress > 25
                                ? 'bg-yellow-500'
                                : 'bg-[#33FEBF]'
                            }`}
                            style={{ width: `${caseItem.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-white">{caseItem.progress}% complete</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <FiMessageSquare className="text-[#33FEBF] mr-1" />
                      <span className="text-sm text-white">Next: {caseItem.nextHearingDate ? formatDate(caseItem.nextHearingDate) : 'No date set'}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-[#33FEBF]">
                      <FiUser className="mr-1" />
                      <span>{caseItem.applicationType || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white mr-2">View Details</span>
                      <FiChevronRight className="text-[#33FEBF]" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-[#33FEBF] to-[#1E90FF] rounded-xl p-6 text-[#141E28]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold mb-2">Need Help With Your Case?</h2>
              <p>Our legal experts are available to assist you with any questions about your case status.</p>
            </div>
            <button className="bg-[#141E28] text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackCasePage;