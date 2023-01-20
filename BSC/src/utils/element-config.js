
export const toastComponent = {
    props: ["title", "content",'color'],
    render(h,) {
      return h("div", {}, [
        h(
          "p",
          {
            style: {
              color: this.color,
              fontSize: "14px",
              margin: "5px",
            },
            domProps: {
              innerHTML: this.title
            }
          },
        ),
        h(
          "p",
          {
            style: {
              fontSize: "13px",
              margin: "5px",
            },
            domProps: {
              innerHTML: this.content
            }
          },
        ),
      ]);
    },
  };