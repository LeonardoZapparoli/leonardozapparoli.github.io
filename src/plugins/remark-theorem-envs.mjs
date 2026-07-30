import { visit } from 'unist-util-visit';
import { annotateNumbers, ENV_KINDS, KIND_LABELS } from './numbering.mjs';

const ALL_ENVS = [...ENV_KINDS, 'proof'];

function span(classNames, text) {
  return {
    type: 'strong',
    data: { hName: 'span', hProperties: { className: classNames } },
    children: [{ type: 'text', value: text }],
  };
}

export function remarkTheoremEnvs() {
  return (tree) => {
    annotateNumbers(tree);

    // Labeled display equations: inject \tag{n}, drop the {#label} paragraph,
    // and wrap in an anchored <div class="equation" id="label">.
    visit(tree, 'math', (node, index, parent) => {
      if (!node.data || !node.data.eqLabel || !parent) return;
      const { eqLabel, eqNumber } = node.data;
      delete node.data.eqLabel;
      delete node.data.eqNumber;
      node.value = `${node.value}\n\\tag{${eqNumber}}`;
      // remark-math pre-computes the hast output in data.hChildren (a <code>
      // element wrapping a text node); keep every text layer in sync
      const hc = node.data.hChildren && node.data.hChildren[0];
      if (hc) {
        hc.value = node.value;
        if (hc.children && hc.children[0] && hc.children[0].type === 'text') {
          hc.children[0].value = node.value;
        }
      }
      const wrapper = {
        type: 'equationWrapper',
        data: {
          hName: 'div',
          hProperties: {
            className: ['equation'],
            id: eqLabel,
            'data-number': eqNumber,
          },
        },
        children: [node],
      };
      parent.children.splice(index, 2, wrapper);
      return index + 1;
    });

    visit(tree, 'containerDirective', (node) => {
      if (!ALL_ENVS.includes(node.name)) return;
      const kind = node.name;
      const id = (node.attributes && node.attributes.id) || null;
      const title = (node.attributes && node.attributes.title) || null;

      node.data = node.data || {};
      const props = { className: ['env', `env-${kind}`] };
      if (id) props.id = id;

      const head = {
        type: 'paragraph',
        data: { hName: 'p', hProperties: { className: ['env-head'] } },
        children: [],
      };

      if (kind === 'proof') {
        head.children.push(span(['env-kind', 'env-kind-proof'], 'Proof.'));
      } else {
        const number = node.data.envNumber;
        props['data-kind'] = kind;
        props['data-number'] = number;
        if (title) {
          head.children.push(span(['env-kind'], `${KIND_LABELS[kind]} ${number}`));
          head.children.push({ type: 'text', value: ' ' });
          head.children.push(span(['env-title'], `(${title}).`));
        } else {
          head.children.push(span(['env-kind'], `${KIND_LABELS[kind]} ${number}.`));
        }
        if (id) {
          head.children.push({
            type: 'link',
            url: `#${id}`,
            data: {
              hProperties: {
                className: ['env-anchor'],
                ariaLabel: `Link to ${KIND_LABELS[kind]} ${number}`,
              },
            },
            children: [{ type: 'text', value: '¶' }],
          });
        }
      }

      node.data.hName = 'section';
      node.data.hProperties = props;
      node.children.unshift(head);
    });
  };
}
