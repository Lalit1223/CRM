// src/pages/Customers/Customers.jsx
import React, { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  MessageSquare,
  Trash2,
  Tag,
} from "lucide-react";
import "./Customers.css";

const Customers = () => {
  const [selectedView, setSelectedView] = useState("all");

  // Sample customer data
  const customers = [
    {
      id: 1,
      name: "Namita Thapar",
      phone: "+919920239003",
      tags: ["VIP", "Active"],
      lastInteraction: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Aman Gupta",
      phone: "+917977749728",
      tags: ["New Lead"],
      lastInteraction: "1 day ago",
      status: "active",
    },
    {
      id: 3,
      name: "Anupam Mittal",
      phone: "+919876543210",
      tags: ["Customer"],
      lastInteraction: "3 days ago",
      status: "active",
    },
    {
      id: 4,
      name: "Piyush Bansal",
      phone: "+918765432109",
      tags: ["Interested"],
      lastInteraction: "1 week ago",
      status: "inactive",
    },
    {
      id: 5,
      name: "Ashneer Grover",
      phone: "+917654321098",
      tags: ["Follow up"],
      lastInteraction: "2 weeks ago",
      status: "active",
    },
  ];

  const views = [
    { id: "all", label: "All Customers", count: customers.length },
    {
      id: "active",
      label: "Active",
      count: customers.filter((c) => c.status === "active").length,
    },
    {
      id: "inactive",
      label: "Inactive",
      count: customers.filter((c) => c.status === "inactive").length,
    },
    {
      id: "vip",
      label: "VIP",
      count: customers.filter((c) => c.tags.includes("VIP")).length,
    },
  ];

  const filteredCustomers =
    selectedView === "all"
      ? customers
      : selectedView === "vip"
      ? customers.filter((c) => c.tags.includes("VIP"))
      : customers.filter((c) => c.status === selectedView);

  return (
    <div className="customers-page">
      <div className="customers-header">
        <h2>Customers</h2>
        <div className="header-actions">
          <button className="import-btn">Import Contacts</button>
          <button className="add-customer-btn">
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      <div className="customers-controls">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search for customers by name or phone"
          />
        </div>
        <button className="filter-button">
          <Filter size={16} />
          <span>Filter</span>
        </button>
      </div>

      <div className="customers-view">
        <div className="view-tabs">
          {views.map((view) => (
            <button
              key={view.id}
              className={`view-tab ${selectedView === view.id ? "active" : ""}`}
              onClick={() => setSelectedView(view.id)}
            >
              {view.label} <span className="count">({view.count})</span>
            </button>
          ))}
        </div>

        <div className="customers-table">
          <div className="table-header">
            <div className="table-cell">Name</div>
            <div className="table-cell">Phone</div>
            <div className="table-cell">Tags</div>
            <div className="table-cell">Last Interaction</div>
            <div className="table-cell actions-cell">Actions</div>
          </div>

          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="table-row">
              <div className="table-cell name-cell">
                <div className="avatar">
                  {customer.name
                    .split(" ")
                    .map((name) => name.charAt(0))
                    .join("")}
                </div>{" "}
                <span className="customer-name">{customer.name}</span>
              </div>
              <div className="table-cell">{customer.phone}</div>
              <div className="table-cell tags-cell">
                {customer.tags.map((tag, index) => (
                  <span key={index} className="customer-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="table-cell">{customer.lastInteraction}</div>
              <div className="table-cell actions-cell">
                <button className="action-btn">
                  <MessageSquare size={16} />
                </button>
                <button className="action-btn">
                  <Tag size={16} />
                </button>
                <button className="action-btn">
                  <Trash2 size={16} />
                </button>
                <button className="action-btn">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Customers;
