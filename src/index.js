const DIRECTIVE = 'x-slot';

export default function ({ types: t }) {
  function isSlotDirective(node) {
    return (
      t.isJSXNamespacedName(node) &&
      t.isJSXIdentifier(node.namespace, { name: DIRECTIVE })
    );
  }

  const slotElementsVisitor = {
    JSXElement(path) {
      const { node, scope } = path;
      if (t.isJSXIdentifier(node.openingElement.name, { name: 'slot' })) {
        let propSlots = '$slots';
        // Guess and add props.$slots reference
        if (scope.hasBinding('props')) {
          propSlots = 'props.$slots';
        } else if (!scope.hasBinding(propSlots)) {
          scope.push({
            id: t.identifier(propSlots),
            init: t.conditionalExpression(
              t.logicalExpression(
                '&&',
                t.thisExpression(),
                t.memberExpression(t.thisExpression(), t.identifier('props')),
              ),
              t.memberExpression(
                t.memberExpression(t.thisExpression(), t.identifier('props')),
                t.identifier('$slots')
              ),
              t.memberExpression(
                t.memberExpression(
                  t.identifier('arguments'),
                  t.numericLiteral(0),
                  true
                ),
                t.identifier('$slots')
              )
            ),
            kind: 'const',
          });
        }

        node.openingElement.name.name = '$slot';
        const { attributes } = node.openingElement;
        attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('$slots'),
            t.jsxExpressionContainer(t.identifier(propSlots))
          )
        );

        const programPath = path.findParent(p => p.isProgram());
        if (!programPath.__import_slot__) {
          programPath.unshiftContainer(
            'body',
            t.importDeclaration(
              [
                t.importSpecifier(
                  t.identifier('$slot'),
                  t.identifier('$slot')
                )
              ],
              t.stringLiteral('babel-runtime-jsx-plus')
            )
          );
          programPath.__import_slot__ = true;
        }
      }
    }
  };

  return {
    visitor: {
      JSXAttribute(path) {
        const { node } = path;
        if (isSlotDirective(node.name)) {
          const slotName = node.name.name.name;
          const slotScope = node.value ? node.value.value : null;
          const currentJSXElementPath = path.findParent(p => p.isJSXElement());
          const parentJSXElementPath = path.findParent(p => {
            return (
              p !== currentJSXElementPath &&
              p.isJSXElement() &&
              !/^[a-z]/.test(p.node.openingElement.name.name)
            );
          });
          if (parentJSXElementPath) {
            const { attributes } = parentJSXElementPath.node.openingElement;
            let $slotAttribute = attributes.filter(jsxAttr =>
              t.isJSXIdentifier(jsxAttr.name, { name: '$slots' })
            )[0];
            if ($slotAttribute === undefined) {
              $slotAttribute = t.jsxAttribute(
                t.jsxIdentifier('$slots'),
                t.jsxExpressionContainer(t.objectExpression([]))
              );
              attributes.push($slotAttribute);
            }
            const slotProperties = $slotAttribute.value.expression.properties;
            slotProperties.push(
              t.objectProperty(
                t.identifier(slotName),
                t.arrowFunctionExpression(
                  slotScope === null ? [] : [t.identifier(slotScope)],
                  currentJSXElementPath.node
                )
              )
            );
            currentJSXElementPath.remove();
          }

          path.remove();
        }
      },

      JSXElement(path) {
        const { node, scope } = path;
        // Prevent JSXElement from being moved by other babel plugins.
        path.traverse(slotElementsVisitor);
      },
    }
  };
}