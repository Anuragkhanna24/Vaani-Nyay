import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FiArrowLeft,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiUser,
  FiCalendar,
  FiMessageSquare,
  FiAlertTriangle
} from 'react-icons/fi';

const CaseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/cases/${id}`);
        setCaseData(response.data.case);
        setError('');
      } catch (err) {
        console.error('Error fetching case:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Error fetching case data.');
      } finally {
        setLoading(false);
      }
    };

    fetchCase();
  }, [id]);

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
        return <FiAlertTriangle className="text-red-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCaseId = (caseId) => {
    if (!caseId) return 'N/A';
    return `VNC-${caseId.substring(0, 4)}-${caseId.substring(4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141E28]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#33FEBF]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#141E28] p-6">
        <div className="bg-red-900 text-white p-6 rounded-xl max-w-md w-full text-center">
          <FiAlertTriangle className="mx-auto text-2xl mb-2" />
          <p className="font-medium">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 bg-[#33FEBF] text-[#141E28] px-4 py-2 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#141E28] p-6">
        <div className="bg-white bg-opacity-10 p-6 rounded-xl max-w-md w-full text-center backdrop-blur-sm border border-white border-opacity-20">
          <p className="mb-4">No case data available.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#33FEBF] text-[#141E28] px-4 py-2 rounded-lg font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141E28] text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-[#33FEBF] hover:text-opacity-80 mb-6 transition"
        >
          <FiArrowLeft className="mr-2" /> Back to Cases
        </button>

        <div className="bg-white bg-opacity-5 rounded-xl p-6 mb-6 backdrop-blur-sm border border-white border-opacity-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{caseData.title}</h1>
              <div className="flex items-center text-[#33FEBF] mb-4">
                <FiFileText className="mr-2" />
                <span>{formatCaseId(caseData.caseId)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseData.status)} flex items-center`}>
                {getStatusIcon(caseData.status)}
                <span className="ml-2">{caseData.status}</span>
              </span>
              <div className="flex items-center text-sm mt-3 text-gray-300">
                <FiCalendar className="mr-2" />
                <span>Created: {formatDate(caseData.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    caseData.progress === 100
                      ? 'bg-green-500'
                      : caseData.progress > 50
                      ? 'bg-blue-500'
                      : caseData.progress > 25
                      ? 'bg-yellow-500'
                      : 'bg-[#33FEBF]'
                  }`}
                  style={{ width: `${caseData.progress}%` }}
                ></div>
              </div>
              <span className="ml-4 text-sm font-medium">{caseData.progress}% complete</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10">
              <h3 className="font-medium text-[#33FEBF] mb-3 flex items-center">
                <FiUser className="mr-2" /> Case Details
              </h3>
              <div className="space-y-2">
                <p><span className="text-gray-300">Type:</span> {caseData.applicationType || 'N/A'}</p>
                <p><span className="text-gray-300">Category:</span> {caseData.category || 'N/A'}</p>
                <p><span className="text-gray-300">Priority:</span> {caseData.priority || 'Standard'}</p>
              </div>
            </div>

            <div className="bg-white bg-opacity-5 p-4 rounded-lg border border-white border-opacity-10">
              <h3 className="font-medium text-[#33FEBF] mb-3 flex items-center">
                <FiMessageSquare className="mr-2" /> Hearing Information
              </h3>
              <div className="space-y-2">
                <p><span className="text-gray-300">Next Hearing:</span> {formatDate(caseData.nextHearingDate)}</p>
                <p><span className="text-gray-300">Last Updated:</span> {formatDate(caseData.updatedAt)}</p>
                <p><span className="text-gray-300">Assigned To:</span> {caseData.assignedTo || 'Not assigned'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white bg-opacity-5 rounded-xl p-6 mb-6 backdrop-blur-sm border border-white border-opacity-10">
          <h2 className="text-xl font-bold text-white mb-4">Documents</h2>
          {caseData.documents && caseData.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caseData.documents.map((doc, index) => (
                <div key={index} className="bg-white bg-opacity-10 p-3 rounded-lg hover:bg-opacity-20 transition cursor-pointer">
                  <div className="flex items-center">
                    <FiFileText className="text-[#33FEBF] mr-3" />
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-300">{doc.type} • {formatDate(doc.uploadedAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">No documents uploaded for this case.</p>
          )}
        </div>

        {/* Case Notes Section */}
        <div className="bg-white bg-opacity-5 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-10">
          <h2 className="text-xl font-bold text-white mb-4">Case Notes</h2>
          {caseData.notes ? (
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <p className="whitespace-pre-line">{caseData.notes}</p>
            </div>
          ) : (
            <p className="text-gray-300">No notes available for this case.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseDetailsPage;