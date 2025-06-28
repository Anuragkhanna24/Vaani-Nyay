import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Building2, Scale, Home, CreditCard, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import apiService from '../apiService';

const Index = () => {
  const navigate = useNavigate();
  const { translate, setSelectedLanguage, selectedLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const forms = [
    { id: 'bank-account', key: 'forms.bankAccount', category: 'banking', icon: Building2, color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
    { id: 'voter-id', key: 'forms.voterId', category: 'identity', icon: CreditCard, color: 'bg-green-50 hover:bg-green-100 border-green-200' },
    { id: 'pan-card', key: 'forms.panCard', category: 'identity', icon: CreditCard, color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
    { id: 'rti', key: 'forms.rti', category: 'legal', icon: Scale, color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
    { id: 'unpaid-salary', key: 'forms.unpaidSalary', category: 'legal', icon: FileText, color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
    { id: 'epf', key: 'forms.epf', category: 'banking', icon: Building2, color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200' },
    { id: 'consumer', key: 'forms.consumer', category: 'legal', icon: Scale, color: 'bg-red-50 hover:bg-red-100 border-red-200' },
    { id: 'grievance', key: 'forms.grievance', category: 'legal', icon: FileText, color: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200' },
    { id: 'cyber', key: 'forms.cyber', category: 'legal', icon: Scale, color: 'bg-pink-50 hover:bg-pink-100 border-pink-200' },
    { id: 'dowry', key: 'forms.dowry', category: 'legal', icon: Scale, color: 'bg-teal-50 hover:bg-teal-100 border-teal-200' },
    { id: 'termination', key: 'forms.termination', category: 'legal', icon: FileText, color: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200' },
    { id: 'domestic', key: 'forms.domestic', category: 'legal', icon: Scale, color: 'bg-rose-50 hover:bg-rose-100 border-rose-200' },
    { id: 'legal', key: 'forms.legal', category: 'legal', icon: Scale, color: 'bg-violet-50 hover:bg-violet-100 border-violet-200' },
    { id: 'pension', key: 'forms.pension', category: 'banking', icon: Building2, color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200' },
    { id: 'traffic', key: 'forms.traffic', category: 'legal', icon: FileText, color: 'bg-amber-50 hover:bg-amber-100 border-amber-200' },
    { id: 'fir', key: 'forms.fir', category: 'legal', icon: Scale, color: 'bg-lime-50 hover:bg-lime-100 border-lime-200' },
    { id: 'divorce', key: 'forms.divorce', category: 'civil', icon: Home, color: 'bg-slate-50 hover:bg-slate-100 border-slate-200' },
    { id: 'partition', key: 'forms.partition', category: 'civil', icon: Home, color: 'bg-gray-50 hover:bg-gray-100 border-gray-200' },
    { id: 'property', key: 'forms.property', category: 'civil', icon: Home, color: 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200' },
    { id: 'name-change', key: 'forms.nameChange', category: 'identity', icon: CreditCard, color: 'bg-stone-50 hover:bg-stone-100 border-stone-200' },
    { id: 'address', key: 'forms.address', category: 'identity', icon: CreditCard, color: 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200' },
    { id: 'birth', key: 'forms.birth', category: 'identity', icon: CreditCard, color: 'bg-sky-50 hover:bg-sky-100 border-sky-200' },
    { id: 'aadhaar', key: 'forms.aadhaar', category: 'identity', icon: CreditCard, color: 'bg-fuchsia-50 hover:bg-fuchsia-100 border-fuchsia-200' }
  ];

  const categories = [
    { id: 'all', key: 'categories.all', label: 'All Categories' },
    { id: 'banking', key: 'categories.banking', label: 'Banking & Financial' },
    { id: 'legal', key: 'categories.legal', label: 'Legal & RTI' },
    { id: 'civil', key: 'categories.civil', label: 'Civil & Property' },
    { id: 'identity', key: 'categories.identity', label: 'Identity & Documents' }
  ];

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
  ];

  const filteredForms = forms.filter(form => {
    const matchesSearch = translate(form.key).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || form.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-[#33FEBF]/5">
      <nav className="w-full bg-[#141E28] text-[#33FEBF] px-6 py-4 flex items-center justify-between shadow mb-8">
        <div className="text-2xl font-bold">Vaani-Nyay</div>
        <div className="flex items-center gap-2">
          <Link
            to="/home"
            className="text-[#33FEBF] hover:underline font-medium px-4 py-2 rounded transition"
          >
            Go to Dashboard
          </Link>
          <Button
            onClick={() => apiService.logout()}
            className="bg-[#33FEBF] text-[#141E28] hover:bg-[#2ad1a3] font-semibold px-4 py-2 rounded transition"
          >
            Logout
          </Button>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Globe className="w-12 h-12 text-[#33FEBF] mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-[#141E28] mb-2">
                {translate('forms.title')}
              </h1>
              <p className="text-lg text-gray-600">
                {translate('forms.subtitle')}
              </p>
            </div>
          </div>

          {/* Language Selection */}
          <div className="max-w-xs mx-auto mb-8">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full border-[#33FEBF] focus:ring-[#33FEBF]">
                <SelectValue placeholder={translate('language.select')} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code} className="hover:bg-[#33FEBF]/10">
                    {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-[#33FEBF]/20 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={translate('search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-[#33FEBF]/30 focus:border-[#33FEBF] focus:ring-[#33FEBF] bg-white"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-64 border-[#33FEBF]/30 focus:ring-[#33FEBF] bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id} className="hover:bg-[#33FEBF]/10">
                      {translate(category.key) !== category.key ? translate(category.key) : category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredForms.map((form) => {
              const IconComponent = form.icon;
              return (
                <Card
                  key={form.id}
                  className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${form.color} border-2 group`}
                  onClick={() => navigate(`/form/${form.id}`)}
                >
                  <CardHeader className="text-center pb-3">
                    <div className="mx-auto mb-3 p-3 rounded-full bg-white/80 group-hover:bg-white transition-colors duration-300">
                      <IconComponent className="w-8 h-8 text-[#141E28]" />
                    </div>
                    <CardTitle className="text-sm font-semibold text-[#141E28] leading-tight group-hover:text-[#141E28] transition-colors duration-300">
                      {translate(form.key)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      className="w-full bg-[#33FEBF] hover:bg-[#33FEBF]/90 text-[#141E28] font-medium border-0 group-hover:shadow-md transition-all duration-300"
                      size="sm"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Fill Form
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {filteredForms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No forms found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
