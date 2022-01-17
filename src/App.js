import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import {
  moveItemAction,
  reorderItemAction,
  removeItemAction,
  addColumnAction,
  removeColumnAction,
  addItemAction,
} from "./actions";
import "./css/style.css";

//\\####STYLING####\\//
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: 30,
  margin: `0 0 20px 0`,
  height: 40,
  background: isDragging ? "#2c2f33" : "#2c2f33",
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  display: "flex",
  flexDirection: "column",
  background: "#23272a",
  padding: 10,
  width: 250,
  marginTop: 10,
  marginInline: 10,
  maxHeight: "96vh",
  overflowY: "auto",
});

//\\####STYLING####//\\

const DragDropList = (props) => {
  const dispatch = useDispatch();
  return (
    <div
      style={{ display: "flex", background: "#2c2f33" }}
    >
      <div class="buttons">
        <button
          type="button"
          class="myButton"
          style={{
            display: "flex",
            justifyContent: "space-around",
            fontFamily: "Uni Sans Heavy",
          }}
          onClick={() => {
            dispatch(addColumnAction());
          }}
        >
          Add new group
        </button>
        <button
          type="button"
          class="myButton"
          style={{
            display: "flex",
            justifyContent: "space-around",
            fontFamily: "Uni Sans Heavy",
          }}
          onClick={() => {
            dispatch(removeColumnAction());
          }}
        >
          Remove last column
        </button>
        <button
          type="button"
          class="myButton"
          style={{
            display: "flex",
            justifyContent: "space-around",
            fontFamily: "Uni Sans Heavy",
          }}
          onClick={() => {
            dispatch(addItemAction());
          }}
        >
          Add new item
        </button>
      </div>

      {props.state.map((el, ind) => (
        <Droppable key={ind} droppableId={`${ind}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {el.map((item, index) => (
                <Draggable
                  class="droppable"
                  key={item.id}
                  draggableId={item.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          fontFamily: "Uni Sans Heavy",
                        }}
                      >
                        {item.content}
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(removeItemAction(index, ind));
                          }}
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </div>
  );
};

export const DragDropListContainer = () => {
  const state = useSelector((state) => state);
  if (state) {
    return <DragDropList state={state} />;
  } else {
    return <span>NO ENTRIES</span>;
  }
};

export const DragDropContextContainer = () => {
  const dispatch = useDispatch();

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceDroppableID = +result.source.droppableId;
    const destinationDroppableID = +result.destination.droppableId;

    if (sourceDroppableID === destinationDroppableID) {
      dispatch(
        reorderItemAction(
          sourceDroppableID,
          result.source.index,
          result.destination.index
        )
      );
    } else {
      dispatch(moveItemAction(result.source, result.destination));
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#2c2f33" }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <DragDropListContainer />
      </DragDropContext>
    </div>
  );
};

export default DragDropContextContainer;
