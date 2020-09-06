import UnclickableBlotSpec from './UnclickableBlotSpec';
import ImageActions from '../ImageActions';

export default class IframeVideoSpec extends UnclickableBlotSpec {
  constructor(formatter: ImageActions) {
    super(formatter, 'iframe.ql-video');
  }
}
