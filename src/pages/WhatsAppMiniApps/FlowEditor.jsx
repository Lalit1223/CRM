// src/pages/WhatsAppMiniApps/FlowEditor.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  PlayCircle,
  Plus,
  Trash2,
  Copy,
  Move,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Edit,
  Layout,
  Type,
  CheckSquare,
  List,
  Calendar,
  FileText,
  Image,
  DollarSign,
  AlertCircle,
  HelpCircle,
  Code,
  Settings,
} from "lucide-react";
import "./FlowEditor.css";

const FlowEditor = () => {
  const { id } = useParams();
  const isNewFlow = !id;

  const [flowName, setFlowName] = useState(
    isNewFlow ? "New Flow" : "Flow Name"
  );
  const [screens, setScreens] = useState([
    {
      id: 1,
      title: "Welcome Screen",
      components: [
        {
          id: 101,
          type: "text",
          content: "Welcome to our survey!",
          settings: { fontSize: "large", align: "center" },
        },
        {
          id: 102,
          type: "paragraph",
          content:
            "Please answer the following questions to help us improve our services.",
          settings: {},
        },
      ],
    },
    {
      id: 2,
      title: "Personal Information",
      components: [
        {
          id: 201,
          type: "text",
          content: "Personal Information",
          settings: { fontSize: "large", align: "center" },
        },
        {
          id: 202,
          type: "textInput",
          label: "Name",
          placeholder: "Enter your full name",
          required: true,
          settings: {},
        },
        {
          id: 203,
          type: "textInput",
          label: "Email",
          placeholder: "Enter your email",
          required: true,
          settings: {},
        },
      ],
    },
  ]);

  const [activeScreen, setActiveScreen] = useState(1);
  const [showComponentsPanel, setShowComponentsPanel] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null);

  // Available component types to add to screens
  const componentTypes = [
    { type: "heading", icon: Type, label: "Heading" },
    { type: "paragraph", icon: FileText, label: "Paragraph" },
    { type: "textInput", icon: Type, label: "Text Input" },
    { type: "dropdown", icon: ChevronDown, label: "Dropdown" },
    { type: "checkbox", icon: CheckSquare, label: "Checkbox" },
    { type: "radio", icon: CheckSquare, label: "Radio Buttons" },
    { type: "datePicker", icon: Calendar, label: "Date Picker" },
    { type: "numberInput", icon: Type, label: "Number Input" },
    { type: "image", icon: Image, label: "Image" },
    { type: "button", icon: FileText, label: "Button" },
    { type: "divider", icon: Layout, label: "Divider" },
    { type: "calculator", icon: DollarSign, label: "Calculator" },
    { type: "conditional", icon: Code, label: "Conditional Logic" },
  ];

  // Add a new screen to the flow
  const handleAddScreen = () => {
    const newScreen = {
      id: screens.length + 1,
      title: `Screen ${screens.length + 1}`,
      components: [],
    };
    setScreens([...screens, newScreen]);
    setActiveScreen(newScreen.id);
  };

  // Add component to active screen
  const handleAddComponent = (componentType) => {
    const activeScreenObj = screens.find(
      (screen) => screen.id === activeScreen
    );
    if (!activeScreenObj) return;

    const newComponent = {
      id: Date.now(),
      type: componentType.type,
      content:
        componentType.type === "heading"
          ? "New Heading"
          : componentType.type === "paragraph"
          ? "New paragraph text"
          : "",
      label: [
        "textInput",
        "dropdown",
        "checkbox",
        "radio",
        "datePicker",
        "numberInput",
      ].includes(componentType.type)
        ? "Label"
        : "",
      placeholder: ["textInput", "dropdown", "numberInput"].includes(
        componentType.type
      )
        ? "Placeholder"
        : "",
      required: false,
      settings: {},
    };

    const updatedScreens = screens.map((screen) => {
      if (screen.id === activeScreen) {
        return {
          ...screen,
          components: [...screen.components, newComponent],
        };
      }
      return screen;
    });

    setScreens(updatedScreens);
    setActiveComponent(newComponent.id);
  };

  // Remove component from active screen
  const handleRemoveComponent = (componentId) => {
    const updatedScreens = screens.map((screen) => {
      if (screen.id === activeScreen) {
        return {
          ...screen,
          components: screen.components.filter(
            (comp) => comp.id !== componentId
          ),
        };
      }
      return screen;
    });

    setScreens(updatedScreens);
    if (activeComponent === componentId) {
      setActiveComponent(null);
    }
  };

  // Update component content
  const handleUpdateComponent = (componentId, updates) => {
    const updatedScreens = screens.map((screen) => {
      if (screen.id === activeScreen) {
        return {
          ...screen,
          components: screen.components.map((comp) => {
            if (comp.id === componentId) {
              return { ...comp, ...updates };
            }
            return comp;
          }),
        };
      }
      return screen;
    });

    setScreens(updatedScreens);
  };

  // Handle save flow
  const handleSaveFlow = () => {
    alert("Flow saved successfully!");
    // Here you would actually save the flow data to your backend
  };

  // Handle preview flow
  const handlePreviewFlow = () => {
    alert("Preview mode would launch here");
    // Here you would handle opening a preview of the flow
  };

  // Render component in editor
  const renderEditorComponent = (component) => {
    switch (component.type) {
      case "text":
      case "heading":
        return <div className="preview-heading">{component.content}</div>;
      case "paragraph":
        return <div className="preview-paragraph">{component.content}</div>;
      case "textInput":
        return (
          <div className="preview-input">
            <label>
              {component.label}
              {component.required && <span className="required">*</span>}
            </label>
            <input type="text" placeholder={component.placeholder} disabled />
          </div>
        );
      case "dropdown":
        return (
          <div className="preview-dropdown">
            <label>
              {component.label}
              {component.required && <span className="required">*</span>}
            </label>
            <select disabled>
              <option>{component.placeholder || "Select an option"}</option>
            </select>
          </div>
        );
      case "checkbox":
        return (
          <div className="preview-checkbox">
            <label>
              <input type="checkbox" disabled />
              {component.label}
            </label>
          </div>
        );
      case "radio":
        return (
          <div className="preview-radio">
            <div className="radio-label">
              {component.label}
              {component.required && <span className="required">*</span>}
            </div>
            <label className="radio-option">
              <input type="radio" name={`radio-${component.id}`} disabled />
              Option 1
            </label>
            <label className="radio-option">
              <input type="radio" name={`radio-${component.id}`} disabled />
              Option 2
            </label>
          </div>
        );
      case "datePicker":
        return (
          <div className="preview-input">
            <label>
              {component.label}
              {component.required && <span className="required">*</span>}
            </label>
            <input type="date" disabled />
          </div>
        );
      case "numberInput":
        return (
          <div className="preview-input">
            <label>
              {component.label}
              {component.required && <span className="required">*</span>}
            </label>
            <input type="number" placeholder={component.placeholder} disabled />
          </div>
        );
      case "image":
        return (
          <div className="preview-image">
            <div className="image-placeholder">
              <Image size={32} />
              <span>Image Placeholder</span>
            </div>
          </div>
        );
      case "button":
        return (
          <div className="preview-button">
            <button disabled>{component.content || "Button"}</button>
          </div>
        );
      case "divider":
        return (
          <div className="preview-divider">
            <hr />
          </div>
        );
      case "calculator":
        return (
          <div className="preview-calculator">
            <div className="calculator-icon">
              <DollarSign size={20} />
            </div>
            <div className="calculator-info">
              <div>Calculator Field</div>
              <div className="calculator-formula">
                Formula: [Configure in properties]
              </div>
            </div>
          </div>
        );
      case "conditional":
        return (
          <div className="preview-conditional">
            <div className="conditional-icon">
              <Code size={20} />
            </div>
            <div className="conditional-info">
              <div>Conditional Logic</div>
              <div className="conditional-formula">
                Condition: [Configure in properties]
              </div>
            </div>
          </div>
        );
      default:
        return <div>Unknown component type: {component.type}</div>;
    }
  };

  // Find current active screen
  const currentScreen =
    screens.find((screen) => screen.id === activeScreen) || screens[0];

  // Find selected component
  const selectedComponent = currentScreen?.components.find(
    (comp) => comp.id === activeComponent
  );

  return (
    <div className="flow-editor-container">
      <div className="editor-header">
        <div className="left-section">
          <Link to="/whatsapp-miniapps" className="back-button">
            <ArrowLeft size={20} />
          </Link>
          <input
            type="text"
            className="flow-name-input"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
          />
        </div>
        <div className="right-section">
          <button
            className="preview-button"
            onClick={handlePreviewFlow}
            title="Preview flow"
          >
            <PlayCircle size={18} />
            <span>Preview</span>
          </button>
          <button
            className="save-button"
            onClick={handleSaveFlow}
            title="Save flow"
          >
            <Save size={18} />
            <span>Save</span>
          </button>
          <button className="settings-button" title="Flow settings">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="editor-content">
        {/* Screens sidebar */}
        <div className="screens-sidebar">
          <div className="sidebar-header">
            <h3>Screens</h3>
            <button
              className="add-screen-button"
              onClick={handleAddScreen}
              title="Add new screen"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="screens-list">
            {screens.map((screen) => (
              <div
                key={screen.id}
                className={`screen-item ${
                  screen.id === activeScreen ? "active" : ""
                }`}
                onClick={() => setActiveScreen(screen.id)}
              >
                <div className="screen-icon">
                  <Layout size={16} />
                </div>
                <div className="screen-title">{screen.title}</div>
                <div className="screen-actions">
                  <button className="edit-button" title="Edit screen title">
                    <Edit size={14} />
                  </button>
                  <button className="duplicate-button" title="Duplicate screen">
                    <Copy size={14} />
                  </button>
                  {screens.length > 1 && (
                    <button className="delete-button" title="Delete screen">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Components panel */}
        <div
          className={`components-panel ${
            showComponentsPanel ? "expanded" : "collapsed"
          }`}
        >
          <div
            className="panel-toggle"
            onClick={() => setShowComponentsPanel(!showComponentsPanel)}
          >
            {showComponentsPanel ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </div>
          <div className="panel-content">
            <h3>Components</h3>
            <div className="components-list">
              {componentTypes.map((compType) => (
                <div
                  key={compType.type}
                  className="component-item"
                  onClick={() => handleAddComponent(compType)}
                >
                  <div className="component-icon">
                    <compType.icon size={16} />
                  </div>
                  <div className="component-label">{compType.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Flow editor main area */}
        <div className="flow-preview">
          <div className="screen-preview">
            <div className="screen-header">
              <h2>{currentScreen?.title}</h2>
            </div>
            <div className="screen-components">
              {currentScreen?.components.map((component) => (
                <div
                  key={component.id}
                  className={`component-wrapper ${
                    activeComponent === component.id ? "selected" : ""
                  }`}
                  onClick={() => setActiveComponent(component.id)}
                >
                  <div className="component-controls">
                    <button className="drag-handle" title="Drag to reorder">
                      <Move size={14} />
                    </button>
                    <button
                      className="remove-component"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveComponent(component.id);
                      }}
                      title="Remove component"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="component-preview">
                    {renderEditorComponent(component)}
                  </div>
                </div>
              ))}
              {currentScreen?.components.length === 0 && (
                <div className="empty-screen">
                  <div className="empty-message">
                    <HelpCircle size={32} />
                    <p>
                      Add components from the panel on the left to build your
                      screen
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties panel */}
        <div className="properties-panel">
          <div className="panel-header">
            <h3>Properties</h3>
          </div>
          <div className="panel-content">
            {selectedComponent ? (
              <div className="component-properties">
                <div className="property-group">
                  <label>Component Type</label>
                  <div className="component-type">
                    {componentTypes.find(
                      (type) => type.type === selectedComponent.type
                    )?.label || selectedComponent.type}
                  </div>
                </div>

                {/* Type-specific properties */}
                {["heading", "paragraph", "button"].includes(
                  selectedComponent.type
                ) && (
                  <div className="property-group">
                    <label>Content</label>
                    <textarea
                      value={selectedComponent.content || ""}
                      onChange={(e) =>
                        handleUpdateComponent(selectedComponent.id, {
                          content: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                )}

                {[
                  "textInput",
                  "dropdown",
                  "checkbox",
                  "radio",
                  "datePicker",
                  "numberInput",
                ].includes(selectedComponent.type) && (
                  <>
                    <div className="property-group">
                      <label>Field Label</label>
                      <input
                        type="text"
                        value={selectedComponent.label || ""}
                        onChange={(e) =>
                          handleUpdateComponent(selectedComponent.id, {
                            label: e.target.value,
                          })
                        }
                      />
                    </div>

                    {["textInput", "dropdown", "numberInput"].includes(
                      selectedComponent.type
                    ) && (
                      <div className="property-group">
                        <label>Placeholder</label>
                        <input
                          type="text"
                          value={selectedComponent.placeholder || ""}
                          onChange={(e) =>
                            handleUpdateComponent(selectedComponent.id, {
                              placeholder: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    <div className="property-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedComponent.required || false}
                          onChange={(e) =>
                            handleUpdateComponent(selectedComponent.id, {
                              required: e.target.checked,
                            })
                          }
                        />
                        Required Field
                      </label>
                    </div>
                  </>
                )}

                {/* Calculator formula */}
                {selectedComponent.type === "calculator" && (
                  <div className="property-group">
                    <label>Formula</label>
                    <input
                      type="text"
                      placeholder="E.g., field1 + field2 * 10"
                      value={selectedComponent.formula || ""}
                      onChange={(e) =>
                        handleUpdateComponent(selectedComponent.id, {
                          formula: e.target.value,
                        })
                      }
                    />
                    <div className="help-text">
                      <AlertCircle size={14} />
                      <span>Use field names to reference other inputs</span>
                    </div>
                  </div>
                )}

                {/* Conditional logic */}
                {selectedComponent.type === "conditional" && (
                  <div className="property-group">
                    <label>Condition</label>
                    <input
                      type="text"
                      placeholder="E.g., field1 == 'yes'"
                      value={selectedComponent.condition || ""}
                      onChange={(e) =>
                        handleUpdateComponent(selectedComponent.id, {
                          condition: e.target.value,
                        })
                      }
                    />
                    <div className="help-text">
                      <AlertCircle size={14} />
                      <span>Use field names to reference other inputs</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-properties">
                <p>Select a component to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowEditor;
