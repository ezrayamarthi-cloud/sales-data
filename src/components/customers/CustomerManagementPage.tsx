import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Building,
  MapPin,
  DollarSign,
  Briefcase,
  X,
  Phone,
} from 'lucide-react';
import type { Customer } from '../../types';

interface CustomerManagementPageProps {
  customers: Customer[];
  onAddCustomer: (customerData: any) => Promise<boolean>;
}

export const CustomerManagementPage: React.FC<CustomerManagementPageProps> = ({
  customers,
  onAddCustomer,
}) => {
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('All');
  const [regionFilter, setRegionFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    region: 'North America',
    segment: 'Enterprise',
    phone: '',
  });

  const regions = useMemo(() => Array.from(new Set(customers.map(c => c.region))), [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);

      const matchesSegment = segmentFilter === 'All' || c.segment === segmentFilter;
      const matchesRegion = regionFilter === 'All' || c.region === regionFilter;
      return matchesSearch && matchesSegment && matchesRegion;
    });
  }, [customers, search, segmentFilter, regionFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onAddCustomer(formData);
    if (ok) {
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        company: '',
        email: '',
        region: 'North America',
        segment: 'Enterprise',
        phone: '',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Customer Accounts & Account Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Account segments, regional allocation, lifetime customer spend, and order history
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Account</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search accounts by name, company, email..."
            className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
          />
        </div>

        <div className="w-full sm:w-48">
          <select
            value={segmentFilter}
            onChange={e => setSegmentFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
          >
            <option value="All">All Segments</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Mid-Market">Mid-Market</option>
            <option value="SMB">SMB</option>
            <option value="Startup">Startup</option>
          </select>
        </div>

        <div className="w-full sm:w-48">
          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
          >
            <option value="All">All Regions</option>
            {regions.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map(c => (
          <div
            key={c.id}
            className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {c.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {c.company}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    c.segment === 'Enterprise'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300'
                      : c.segment === 'Mid-Market'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {c.segment}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{c.region}</span>
                </div>
                {c.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{c.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Lifetime Spend</span>
                <span className="font-extrabold text-slate-900 dark:text-white">
                  ${c.totalSpent.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Orders</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {c.ordersCount} deals
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                Add New Client Account
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jessica Chen"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. CyberVanguard Systems"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@cybervanguard.io"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Region
                  </label>
                  <select
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="North America">North America</option>
                    <option value="Europe & UK">Europe & UK</option>
                    <option value="Asia-Pacific">Asia-Pacific</option>
                    <option value="Latin America">Latin America</option>
                    <option value="Middle East & Africa">Middle East & Africa</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Segment
                  </label>
                  <select
                    value={formData.segment}
                    onChange={e => setFormData({ ...formData, segment: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="Mid-Market">Mid-Market</option>
                    <option value="SMB">SMB</option>
                    <option value="Startup">Startup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555 123 4567"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
