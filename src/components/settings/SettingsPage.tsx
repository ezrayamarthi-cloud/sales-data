import React, { useState } from 'react';
import {
  Settings,
  Database,
  Code2,
  Shield,
  RefreshCw,
  Copy,
  Check,
  Server,
  Layers,
  FileCode,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SettingsPageProps {
  onResetData: () => Promise<void>;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onResetData }) => {
  const { user, switchRole } = useAuth();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [activeCodeTab, setActiveCodeTab] = useState<'mysql' | 'spring-pom' | 'spring-entity' | 'spring-service' | 'spring-controller'>('mysql');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleReset = async () => {
    await onResetData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  const mysqlSchemaCode = `-- MySQL 8.0+ Enterprise Sales Analytics Schema
CREATE TABLE regions (
    region_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    manager_name VARCHAR(120) NOT NULL,
    target_quarterly DECIMAL(14, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE categories (
    category_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50)
);

CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ROLE_ADMIN', 'ROLE_USER') NOT NULL,
    department VARCHAR(80)
);

CREATE TABLE customers (
    customer_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    company VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    region_id VARCHAR(36) NOT NULL,
    segment ENUM('Enterprise', 'Mid-Market', 'SMB', 'Startup'),
    FOREIGN KEY (region_id) REFERENCES regions(region_id)
);

CREATE TABLE products (
    product_id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category_id VARCHAR(36) NOT NULL,
    sku VARCHAR(50) NOT NULL UNIQUE,
    unit_price DECIMAL(10, 2) NOT NULL,
    unit_cost DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE sales (
    sale_id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL UNIQUE,
    order_date DATE NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    customer_id VARCHAR(36) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    unit_cost DECIMAL(10, 2) NOT NULL,
    revenue DECIMAL(14, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    profit DECIMAL(14, 2) GENERATED ALWAYS AS (quantity * (unit_price - unit_cost)) STORED,
    FOREIGN KEY (product_id) REFERENCES products(product_id),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);`;

  const springPomCode = `<!-- Spring Boot 3 pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
<dependency>
    <groupId>org.apache.poi</groupId>
    <artifactId>poi-ooxml</artifactId>
    <version>5.2.5</version>
</dependency>`;

  const springEntityCode = `package com.enterprise.sales.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "sales")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Sale {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String orderId;

    private LocalDate orderDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal unitCost;
}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          System Settings & Enterprise Architecture
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          User access control, MySQL relational DDL schemas, and Java Spring Boot 3 reference backend
        </p>
      </div>

      {/* Grid: Profile & Role Control + Data Reset */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Profile & Role Switcher */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
            <Shield className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Authentication & Role Permissions (RBAC)
            </h2>
          </div>

          <div className="mt-4 flex items-center gap-4">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {user?.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email} • {user?.department}
              </p>
              <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Current Role: {user?.role.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/50">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Toggle Active Role (Instant Privilege Test):
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => switchRole('admin')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  user?.role === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>Administrator (Full Access)</span>
              </button>
              <button
                onClick={() => switchRole('user')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  user?.role === 'user'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>Sales User (Read/Add)</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Admins can edit/delete products & sales. Standard users are restricted from destructive modifications.
            </p>
          </div>
        </div>

        {/* System Data Maintenance */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700/60">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Dataset Maintenance & Factory Reset
              </h2>
            </div>

            <p className="mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If test orders or uploaded CSVs altered your financial numbers, you can reset all tables back to the pristine 125 sample enterprise records anytime with a single click.
            </p>

            {resetSuccess && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Successfully restored 125 sample transactions and initial catalog!</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60">
            <button
              onClick={handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4 text-blue-600" />
              <span>Restore Factory Sample Dataset (125 Records)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Architecture & Code Viewer: MySQL & Spring Boot */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60 gap-3">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Backend & Database Architecture Explorer
              </h2>
              <span className="text-[11px] text-slate-400">
                Full production code generated in `/database/schema.sql` & `/backend-spring-boot`
              </span>
            </div>
          </div>

          {/* Code Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveCodeTab('mysql')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                activeCodeTab === 'mysql'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              MySQL DDL Schema
            </button>
            <button
              onClick={() => setActiveCodeTab('spring-pom')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                activeCodeTab === 'spring-pom'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              pom.xml
            </button>
            <button
              onClick={() => setActiveCodeTab('spring-entity')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                activeCodeTab === 'spring-entity'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Sale.java (JPA)
            </button>
          </div>
        </div>

        {/* Code Display Area */}
        <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-950 text-slate-200 font-mono text-xs p-4">
          <button
            onClick={() => {
              const code =
                activeCodeTab === 'mysql'
                  ? mysqlSchemaCode
                  : activeCodeTab === 'spring-pom'
                  ? springPomCode
                  : springEntityCode;
              copyToClipboard(code, activeCodeTab);
            }}
            className="absolute right-3 top-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1.5 transition-colors"
          >
            {copiedSection === activeCodeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <pre className="overflow-x-auto max-h-80 leading-relaxed">
            <code>
              {activeCodeTab === 'mysql' && mysqlSchemaCode}
              {activeCodeTab === 'spring-pom' && springPomCode}
              {activeCodeTab === 'spring-entity' && springEntityCode}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};
