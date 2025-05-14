document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const timetableGrid = document.querySelector(".timetable-grid");
  const sessionCards = document.querySelectorAll(".session-card");
  const gridCells = document.querySelectorAll(".grid-cell");
  const filterSelect = document.getElementById("filter");
  const departmentSelect = document.getElementById("department");
  const zoomSlider = document.getElementById("zoom");
  const viewTabs = document.querySelectorAll(".tab-btn");
  const resetViewBtn = document.querySelector(
    ".timetable-actions .btn-outline:first-child",
  );
  const printScheduleBtn = document.querySelector(
    ".timetable-actions .btn-outline:nth-child(2)",
  );
  const saveChangesBtn = document.querySelector(
    ".timetable-actions .btn-primary",
  );

  // Drag and drop functionality
  let draggedSession = null;

  // Add event listeners to session cards for drag and drop
  sessionCards.forEach((card) => {
    card.addEventListener("dragstart", handleDragStart);
  });

  // Add event listeners to grid cells for drag and drop
  gridCells.forEach((cell) => {
    cell.addEventListener("dragover", handleDragOver);
    cell.addEventListener("drop", handleDrop);
  });

  // Add event listeners to filter controls
  filterSelect.addEventListener("change", applyFilters);
  departmentSelect.addEventListener("change", applyFilters);

  // Add event listener to zoom slider
  zoomSlider.addEventListener("input", handleZoomChange);

  // Add event listeners to view tabs
  viewTabs.forEach((tab) => {
    tab.addEventListener("click", handleViewChange);
  });

  // Add event listeners to action buttons
  resetViewBtn.addEventListener("click", resetView);
  printScheduleBtn.addEventListener("click", printSchedule);
  saveChangesBtn.addEventListener("click", saveChanges);

  // Function to handle drag start
  function handleDragStart(e) {
    draggedSession = this;
    e.dataTransfer.setData("text/plain", this.getAttribute("data-id"));
    this.classList.add("dragging");
  }

  // Function to handle drag over
  function handleDragOver(e) {
    e.preventDefault();
    this.classList.add("drag-over");
  }

  // Function to handle drop
  function handleDrop(e) {
    e.preventDefault();
    this.classList.remove("drag-over");

    const sessionId = e.dataTransfer.getData("text/plain");
    const day = this.getAttribute("data-day");
    const timeSlot = this.getAttribute("data-time");

    // Check for conflicts (in a real app, this would be an AJAX call to the server)
    const hasConflict = checkForConflicts(sessionId, day, timeSlot);

    if (hasConflict) {
      showConflictWarning(sessionId, day, timeSlot);
    } else {
      // Move the session card to the new cell
      if (draggedSession) {
        this.appendChild(draggedSession);
        draggedSession.classList.remove("dragging");

        // In a real app, you would send an AJAX request to update the session's day and time
        console.log(`Moved session ${sessionId} to ${day} at ${timeSlot}`);

        // For demo purposes, show a success message
        showNotification("Session moved successfully", "success");
      }
    }

    draggedSession = null;
  }

  // Function to check for conflicts (mock implementation)
  function checkForConflicts(sessionId, day, timeSlot) {
    // In a real app, this would be an AJAX call to check for conflicts on the server
    // For demo purposes, randomly return true or false
    return Math.random() > 0.7;
  }

  // Function to show conflict warning
  function showConflictWarning(sessionId, day, timeSlot) {
    // In a real app, this would show a modal with conflict details
    // For demo purposes, show an alert
    showNotification(
      "Conflict detected! This would cause a scheduling conflict.",
      "error",
    );
  }

  // Function to apply filters
  function applyFilters() {
    const filter = filterSelect.value;
    const department = departmentSelect.value;

    // In a real app, this would be an AJAX call to filter the sessions
    // For demo purposes, just log the filter values
    console.log(`Applying filters: ${filter}, ${department}`);

    // Update the URL with the filter parameters
    const url = new URL(window.location.href);
    url.searchParams.set("filter", filter);
    url.searchParams.set("department", department);
    window.history.replaceState({}, "", url);

    // For demo purposes, show a success message
    showNotification("Filters applied", "success");
  }

  // Function to handle zoom change
  function handleZoomChange() {
    const zoomLevel = zoomSlider.value;
    const cellHeight = 60 + zoomLevel * 0.6;

    // Update the height of time slots and grid cells
    document.querySelectorAll(".time-slot, .grid-cell").forEach((el) => {
      el.style.height = `${cellHeight}px`;
    });

    // Update the URL with the zoom parameter
    const url = new URL(window.location.href);
    url.searchParams.set("zoom", zoomLevel);
    window.history.replaceState({}, "", url);
  }

  // Function to handle view change
  function handleViewChange() {
    const view = this.getAttribute("data-view");

    // Update active tab
    viewTabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    this.classList.add("active");

    // In a real app, this would update the view
    // For demo purposes, just log the view
    console.log(`Changing view to: ${view}`);

    // Update the URL with the view parameter
    const url = new URL(window.location.href);
    url.searchParams.set("view", view);
    window.history.replaceState({}, "", url);

    // For demo purposes, show a success message
    showNotification(`View changed to ${view}`, "success");
  }

  // Function to reset view
  function resetView() {
    // Reset filters
    filterSelect.value = "all";
    departmentSelect.value = "all";

    // Reset zoom
    zoomSlider.value = 50;
    handleZoomChange();

    // Reset view
    viewTabs.forEach((tab) => {
      if (tab.getAttribute("data-view") === "week") {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    // Reset URL parameters
    const url = new URL(window.location.href);
    url.searchParams.delete("filter");
    url.searchParams.delete("department");
    url.searchParams.delete("zoom");
    url.searchParams.delete("view");
    window.history.replaceState({}, "", url);

    // For demo purposes, show a success message
    showNotification("View reset to defaults", "success");
  }

  // Function to print schedule
  function printSchedule() {
    // In a real app, this would open a print-friendly version
    // For demo purposes, just use the browser's print function
    window.print();
  }

  // Function to save changes
  function saveChanges() {
    // In a real app, this would send an AJAX request to save all changes
    // For demo purposes, show a success message
    showNotification("Changes saved successfully", "success");
  }

  // Function to show notification
  function showNotification(message, type) {
    // Check if notification container exists, if not create it
    let notificationContainer = document.querySelector(
      ".notification-container",
    );
    if (!notificationContainer) {
      notificationContainer = document.createElement("div");
      notificationContainer.className = "notification-container";
      document.body.appendChild(notificationContainer);
    }

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
            </div>
            <div class="notification-message">${message}</div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

    // Add notification to container
    notificationContainer.appendChild(notification);

    // Add event listener to close button
    notification
      .querySelector(".notification-close")
      .addEventListener("click", function () {
        notification.remove();
      });

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }

  // Add styles for notifications
  const style = document.createElement("style");
  style.textContent = `
        .notification-container {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            max-width: 300px;
        }
        
        .notification {
            padding: 1rem;
            border-radius: var(--radius);
            background-color: var(--background);
            border: 1px solid var(--border);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification.success {
            border-left: 4px solid #10b981;
        }
        
        .notification.error {
            border-left: 4px solid var(--destructive);
        }
        
        .notification-icon {
            font-size: 1.25rem;
        }
        
        .notification.success .notification-icon {
            color: #10b981;
        }
        
        .notification.error .notification-icon {
            color: var(--destructive);
        }
        
        .notification-message {
            flex: 1;
            font-size: 0.875rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--muted-foreground);
        }
        
        .notification-close:hover {
            color: var(--foreground);
        }
        
        .dragging {
            opacity: 0.5;
        }
        
        .drag-over {
            background-color: var(--accent);
        }
    `;
  document.head.appendChild(style);
});
