import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import api from "../services/api";
import { Building2, User } from 'lucide-react';

const KanbanBoard = ({ deals, refreshDeals, onDealClick }) => {
  const stages = [
    'Qualification', 'Needs Analysis', 'Proposal', 
    'Negotiation', 'Closed Won', 'Closed Lost'
  ];

  const columns = stages.reduce((acc, stage) => {
    acc[stage] = deals.filter(d => d.stage === stage);
    return acc;
  }, {});

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    //ignore same position drops
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newStage = destination.droppableId;

    try {
      await api.put(`/deals/${draggableId}`, { stage: newStage });
      
      refreshDeals();
    } catch (err) {
      alert("Failed to update deal stage");
      console.error(err);
    }
  };

  return (
    // Drag-drop control handle
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={styles.board} className="kanban-board">
        {stages.map((stage) => (
          <Droppable droppableId={stage} key={stage}>
            {/* dnd library */}
            {(provided, snapshot) => (
              <div
                style={{
                  ...styles.column,
                  backgroundColor: snapshot.isDraggingOver
                    ? "#E8F3FF"
                    : "#F3F4F6",
                }}
                // wo this dnd will not work
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h4 style={styles.header}>
                  {stage.toUpperCase()}
                  <span style={styles.count}>({columns[stage].length})</span>
                </h4>

                <div style={styles.list}>
                  {columns[stage].map((deal, index) => (
                    <Draggable
                      key={deal._id}
                      draggableId={deal._id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          onClick={() => onDealClick(deal)}
                          style={{
                            ...styles.card,
                            boxShadow: snapshot.isDragging
                              ? "0 5px 10px rgba(0,0,0,0.1)"
                              : "0 1px 2px rgba(0,0,0,0.05)",
                          }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <h5 style={styles.cardTitle}>{deal.title}</h5>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.25rem",
                            }}
                          >
                            <small
                              style={{
                                color: "#0A66C2",
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Building2 size={14} />{" "}
                              {deal.accountId?.companyName || "Unknown Inc."}
                            </small>
                            <small
                              style={{
                                color: "#6B7280",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <User size={14} />{" "}
                              {deal.contactId?.name || "Unknown"}
                            </small>
                          </div>
                          <span style={styles.amount}>
                            ${(deal.value || 0).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

const styles = {
  board: { display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', minHeight: '500px' },
  column: { minWidth: '280px', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #E5E7EB' },
  header: { color: '#0A66C2', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  count: { backgroundColor: '#E8F3FF', color: '#0A66C2', padding: '0.1rem 0.5rem', borderRadius: '12px', fontSize: '0.8rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 },
  card: { backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '6px', border: '1px solid #E5E7EB', cursor: 'pointer' },
  cardTitle: { margin: '0 0 0.5rem 0', color: '#1F2937' },
  amount: { display: 'block', marginTop: '0.5rem', fontWeight: 'bold', color: '#10B981' },
};

export default KanbanBoard;
