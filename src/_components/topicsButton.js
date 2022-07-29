function TopicsButton({ topics, url, ariaDescribedBy }) {
  return /* html */ `
    <a href="${url}" class="topicsButton" aria-describedby="${ariaDescribedBy}">
      <ul class="topicsButton__list">
        ${topics
          .map((topic) => {
            return /*html*/ `
            <li>
              <img aria-label="${topic.name}"
                  src="${topic.icon.url}"
                  alt="${topic.icon.description}"
                  height="24"
                  width="24"
              />
            </li>`;
          })
          .join("")}
          <li>Learn more</li>
      </ul>
    </a>
    `;
}

module.exports = TopicsButton;
