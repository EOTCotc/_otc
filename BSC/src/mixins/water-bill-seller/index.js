import { Getwsid } from "@/api/payverification";
import { setItem, getItem } from "@/utils/storage";

export default {
  methods: {
    async get_token(tokenObj, user) {
      try {
        if (!tokenObj?.[this.curRole]) {
          const { data } = await Getwsid({
            oid:this.MerchanInfo.odid,
            user,
            otype: 1,
          });
          setItem(
            `cs-${this.MerchanInfo.odid}`,
            Object.assign({}, {
              [this.curRole]: data.State,
            })
          );
          this.token = data.State;
        } else if (tokenObj?.[this.curRole] == "0") {
          const { data } = await Getwsid({
            oid:this.MerchanInfo.odid,
            user,
            otype: 1,
          });
          setItem(
            `cs-${this.MerchanInfo.odid}`,
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
