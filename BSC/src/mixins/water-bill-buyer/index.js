import { Getwsid } from "@/api/payverification";
import { setItem, getItem } from "@/utils/storage";

export default {
  methods: {
    async get_token(tokenObj, user) {
      try {
        if (!tokenObj?.[this.curRole]) {
          const { data } = await Getwsid({
            oid: this.odid,
            user,
          });
          console.log(tokenObj)
          console.log(this.odid)
          setItem(
            this.odid,
            Object.assign({}, {
              [this.curRole]: data.State,
            })
          );
          this.token = data.State;
        } else if (tokenObj?.[this.curRole] == "0") {
          const { data } = await Getwsid({
            oid: this.odid,
            user,
          });
          console.log('0',tokenObj)
          console.log('0',this.odid)
          setItem(
            this.odid,
            Object.assign(tokenObj, {
              [this.curRole]: data.State,
            })
          );
          this.token = data.State;
        } else {
          this.token = tokenObj[this.curRole];
        }
        this.init_pagewater_bill();
      } catch (err) {
        console.warn(err);
      }
    },
  },
};
