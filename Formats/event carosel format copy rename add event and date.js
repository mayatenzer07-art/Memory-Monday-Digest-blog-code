/*
 * EVENT CAROUSEL FORMAT
 * =====================
 *
 * HOW TO ADD ONE MORE CAROUSEL:
 * 1. Copy this file into the Formats folder and give it a short unique name.
 * 2. Change CAROUSEL_ID below to the matching unique ID in the article HTML.
 * 3. Change CAROUSEL_TITLE if the script should add a heading.
 * 4. Replace the example memories array with 5-15 entries.
 * 5. Add a script tag to the article HTML, using the new file name:
 *    <script src="../Formats/event-carousel-team-picks.js"></script>
 *
 * HTML:
 * <div id="event-carousel-team-picks"></div>
 * If CAROUSEL_TITLE is blank, put the event heading in the HTML above this div.
 *
 * Keep src, alt, memoryUrl, caption, username, profileUrl, totalAttnStaked,
 * and creatorEarnings filled for each memory.
 */

(function createEventCarousel() {
    const CAROUSEL_ID = "event-carousel-top-events";
    const CAROUSEL_TITLE = "";

    const memories = [
    { type: "image", src: "", alt: "", memoryUrl: "", caption: "", captionUrl: "", username: "", profileUrl: "", country: "", city: "", date: "", totalAttnStaked: "", creatorEarnings: "" },
    { type: "image", src: "", alt: "", memoryUrl: "", caption: "", captionUrl: "", username: "", profileUrl: "", country: "", city: "", date: "", totalAttnStaked: "", creatorEarnings: "" },
    { type: "image", src: "", alt: "", memoryUrl: "", caption: "", captionUrl: "", username: "", profileUrl: "", country: "", city: "", date: "", totalAttnStaked: "", creatorEarnings: "" },
    { type: "image", src: "", alt: "", memoryUrl: "", caption: "", captionUrl: "", username: "", profileUrl: "", country: "", city: "", date: "", totalAttnStaked: "", creatorEarnings: "" },
    { type: "image", src: "", alt: "", memoryUrl: "", caption: "", captionUrl: "", username: "", profileUrl: "", country: "", city: "", date: "", totalAttnStaked: "", creatorEarnings: "" }
    ];

    const container = document.getElementById(CAROUSEL_ID);
    if (!container) return;

    let currentIndex = 0;

    container.innerHTML = `
        ${CAROUSEL_TITLE ? `<h2>${CAROUSEL_TITLE}</h2>` : ""}
        <section class="event-carousel" aria-label="${CAROUSEL_TITLE || "Event carousel"}">
            <p class="event-carousel__error" hidden></p>
            <div class="event-carousel__stage" aria-live="polite">
                <button class="event-carousel__arrow event-carousel__previous" type="button" aria-label="Previous memory">‹</button>
                <div class="event-carousel__media"></div>
                <button class="event-carousel__arrow event-carousel__next" type="button" aria-label="Next memory">›</button>
            </div>
            <div class="event-carousel__details"></div>
        </section>
        <dialog class="event-carousel__viewer" aria-label="Expanded memory media">
            <button class="event-carousel__close" type="button" aria-label="Close expanded media">×</button>
            <div class="event-carousel__expanded"></div>
        </dialog>
    `;

    const stage = container.querySelector(".event-carousel__stage");
    const media = container.querySelector(".event-carousel__media");
    const details = container.querySelector(".event-carousel__details");
    const previous = container.querySelector(".event-carousel__previous");
    const next = container.querySelector(".event-carousel__next");
    const error = container.querySelector(".event-carousel__error");
    const viewer = container.querySelector(".event-carousel__viewer");
    const expanded = container.querySelector(".event-carousel__expanded");
    const closeViewer = container.querySelector(".event-carousel__close");

    function linkedText(text, url) {
        if (!text) return null;
        if (!url) {
            const span = document.createElement("span");
            span.textContent = text;
            return span;
        }
        const link = document.createElement("a");
        link.textContent = text;
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        return link;
    }

    function openViewer(memory) {
        const element = document.createElement(memory.type === "video" ? "video" : "img");
        element.src = memory.src;
        if (memory.type === "video") {
            element.controls = true;
            element.playsInline = true;
        } else {
            element.alt = memory.alt || "";
        }
        expanded.replaceChildren(element);
        viewer.showModal();
    }

    function render() {
        const memory = memories[currentIndex];
        media.replaceChildren();
        details.replaceChildren();

        if (memory.src) {
            if (memory.type === "video") {
                const wrapper = document.createElement("div");
                wrapper.className = "event-carousel__media-video";
                const video = document.createElement("video");
                video.src = memory.src;
                video.controls = true;
                video.playsInline = true;
                wrapper.appendChild(video);
                media.appendChild(wrapper);
            } else {
                const button = document.createElement("button");
                button.className = "event-carousel__media-open";
                button.type = "button";
                button.setAttribute("aria-label", `Expand memory ${currentIndex + 1}`);
                const image = document.createElement("img");
                image.src = memory.src;
                image.alt = memory.alt || "";
                button.appendChild(image);
                button.addEventListener("click", () => openViewer(memory));
                media.appendChild(button);
            }
        } else {
            const placeholder = document.createElement("p");
            placeholder.className = "event-carousel__placeholder";
            placeholder.textContent = "Add an image or video in the memories list.";
            media.appendChild(placeholder);
        }

        const count = document.createElement("p");
        count.className = "event-carousel__count";
        const countText = linkedText(`Memory ${currentIndex + 1}/${memories.length}`, memory.memoryUrl);
        if (countText) count.appendChild(countText);
        details.appendChild(count);

        const caption = document.createElement("p");
        const captionText = linkedText(memory.caption, memory.captionUrl);
        if (captionText) caption.appendChild(captionText);
        if (caption.childNodes.length) details.appendChild(caption);

        const username = document.createElement("p");
        const usernameText = linkedText(memory.username, memory.profileUrl);
        if (usernameText) username.appendChild(usernameText);
        if (username.childNodes.length) details.appendChild(username);

        const extra = [];
        const location = [memory.country, memory.city].filter(Boolean).join(", ");
        if (location) extra.push(location);
        if (memory.date) extra.push(memory.date);
        if (memory.totalAttnStaked) extra.push(`Total ATTN staked: ${memory.totalAttnStaked}`);
        if (memory.creatorEarnings) extra.push(`Creator earnings: ${memory.creatorEarnings}`);
        if (extra.length) {
            const extraLine = document.createElement("p");
            extraLine.textContent = extra.join(" | ");
            details.appendChild(extraLine);
        }

        previous.disabled = currentIndex === 0;
        next.disabled = currentIndex === memories.length - 1;
    }

    if (memories.length < 5 || memories.length > 15) {
        error.hidden = false;
        error.textContent = "This carousel needs between 5 and 15 entries.";
        stage.hidden = true;
    } else {
        render();
    }

    previous.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + memories.length) % memories.length;
        render();
    });

    next.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % memories.length;
        render();
    });
    closeViewer.addEventListener("click", () => viewer.close());
})();
