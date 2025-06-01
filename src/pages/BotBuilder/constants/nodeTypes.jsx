// src/pages/BotBuilder/constants/nodeTypes.jsx
import React from "react";
import { Handle, Position } from "reactflow";

// Custom Node components with handles
const TriggerNode = ({ data }) => (
  <div className="custom-node trigger-node">
    {/* Output handle at the bottom of the node */}
    <Handle type="source" position={Position.Bottom} id="a" />

    <div className="node-header">{data.label}</div>
    <div className="node-content">
      <div className="node-type">Type: {data.triggerType}</div>
      {data.condition && (
        <div className="node-condition">Keywords: {data.condition}</div>
      )}
    </div>
  </div>
);

const MessageNode = ({ data }) => (
  <div className="custom-node message-node">
    {/* Input handle at the top of the node */}
    <Handle type="target" position={Position.Top} id="a" />

    <div className="node-header">{data.label}</div>
    <div className="node-content">
      <div className="node-message">{data.message}</div>
      {data.waitForReply && (
        <div className="node-wait">Waiting for reply: Yes</div>
      )}
    </div>

    {/* Output handle at the bottom of the node */}
    <Handle type="source" position={Position.Bottom} id="b" />
  </div>
);

const QuestionNode = ({ data }) => (
  <div className="custom-node question-node">
    {/* Input handle at the top of the node */}
    <Handle type="target" position={Position.Top} id="a" />

    <div className="node-header">{data.label}</div>
    <div className="node-content">
      <div className="node-question">{data.question}</div>
      {data.buttons && data.buttons.length > 0 && (
        <div className="node-buttons">
          <div className="button-count">{data.buttons.length} options</div>
          <div className="button-list">
            {data.buttons.slice(0, 2).map((button) => (
              <div key={button.id} className="button-item">
                {button.text}
              </div>
            ))}
            {data.buttons.length > 2 && <div className="button-more">...</div>}
          </div>
        </div>
      )}
    </div>

    {/* Output handle at the bottom of the node */}
    <Handle type="source" position={Position.Bottom} id="b" />
  </div>
);

const RouterNode = ({ data }) => (
  <div className="custom-node router-node">
    {/* Input handle at the top of the node */}
    <Handle type="target" position={Position.Top} id="a" />

    <div className="node-header">{data.label}</div>
    <div className="node-content">
      <div className="node-conditions">
        {data.conditions && data.conditions.length > 0 ? (
          <div className="condition-count">
            {data.conditions.length} conditions
          </div>
        ) : (
          <div className="no-conditions">No conditions defined</div>
        )}
      </div>
    </div>

    {/* Output handle at the bottom of the node */}
    <Handle type="source" position={Position.Bottom} id="b" />

    {/* Additional output handle on the right for conditions */}
    <Handle type="source" position={Position.Right} id="c" />
  </div>
);

const AssignNode = ({ data }) => (
  <div className="custom-node assign-node">
    {/* Input handle at the top of the node */}
    <Handle type="target" position={Position.Top} id="a" />

    <div className="node-header">{data.label}</div>
    <div className="node-content">
      <div className="node-agent">Agent: {data.agentId || "Not specified"}</div>
      {data.team && <div className="node-team">Team: {data.team}</div>}
    </div>

    {/* Output handle at the bottom of the node */}
    <Handle type="source" position={Position.Bottom} id="b" />
  </div>
);

const WebhookNode = ({ data }) => (
  <div className="custom-node webhook-node">
    {/* Input handle at the top of the node */}
    <Handle type="target" position={Position.Top} id="a" />

    <div className="node-header">{data.label}</div>
    <div className="node-content">
      <div className="node-method">{data.method || "GET"}</div>
      <div className="node-url">{data.url || "URL not set"}</div>
    </div>

    {/* Output handle at the bottom of the node */}
    <Handle type="source" position={Position.Bottom} id="b" />
  </div>
);

const GoogleSheetNode = ({ data }) => (
  <div className="custom-node sheet-node">
    {/* Input handle at the top of the node */}
    <Handle type="target" position={Position.Top} id="a" />

    <div className="node-header">{data.label}</div>
    <div className="node-content">
      <div className="node-sheet-id">
        Sheet: {data.sheetId ? `...${data.sheetId.slice(-6)}` : "Not set"}
      </div>
      <div className="node-lookup">
        Lookup: {data.lookupColumn ? `Column ${data.lookupColumn}` : "Not set"}
      </div>
    </div>

    {/* Output handle at the bottom of the node */}
    <Handle type="source" position={Position.Bottom} id="b" />
  </div>
);

const StayInSessionNode = ({ data }) => (
  <div className="custom-node session-node">
    {/* Input handle at the top of the node */}
    <Handle type="target" position={Position.Top} id="a" />

    <div className="node-header">{data.label}</div>
    <div className="node-content">
      <div className="node-message">
        {data.message
          ? data.message.length > 30
            ? `${data.message.slice(0, 30)}...`
            : data.message
          : "No message set"}
      </div>
    </div>

    {/* Terminal nodes don't need output handles */}
  </div>
);

// Export the node types for use in ReactFlow
export const nodeTypes = {
  triggerNode: TriggerNode,
  messageNode: MessageNode,
  questionNode: QuestionNode,
  routerNode: RouterNode,
  assignNode: AssignNode,
  webhookNode: WebhookNode,
  googleSheetNode: GoogleSheetNode,
  stayInSessionNode: StayInSessionNode,
};
